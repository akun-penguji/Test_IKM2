<?php

namespace App\Imports;

use App\Exceptions\QuizResponseImportException;
use App\Models\Lokus;
use App\Models\QuizResponse;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Throwable;

class QuizResponseImport implements ToCollection, WithHeadingRow
{
    public const REQUIRED_HEADINGS = [
        'tanggal_diisi',
        'jenis_kelamin',
        'pendidikan',
        'pekerjaan',
        'u1',
        'u2',
        'u3',
        'u4',
        'u5',
        'u6',
        'u7',
        'u8',
        'u9',
        'pesan_dan_saran',
        'layanan',
        'lokus',
    ];

    public int $insertedCount = 0;

    public int $skippedCount = 0;

    public function __construct(private readonly User $user, private readonly array $headings)
    {
    }

    public function collection(Collection $rows): void
    {
        $headingErrors = $this->validateHeadings();
        if ($headingErrors !== []) {
            throw new QuizResponseImportException($headingErrors);
        }

        $serviceLookup = $this->buildLookup(Service::all());
        $lokusLookup = $this->buildLookup(Lokus::all());
        $preparedRows = [];
        $errors = [];
        $fingerprints = [];

        foreach ($rows as $index => $row) {
            $row = $row instanceof Collection ? $row : collect($row);
            if ($this->isEmptyRow($row)) {
                continue;
            }

            $rowNumber = $index + 2;
            [$prepared, $rowErrors] = $this->prepareRow($row, $rowNumber, $serviceLookup, $lokusLookup);

            if ($rowErrors !== []) {
                array_push($errors, ...$rowErrors);
                continue;
            }

            $fingerprint = $this->fingerprint($prepared);
            if (isset($fingerprints[$fingerprint])) {
                $this->skippedCount++;
                continue;
            }

            $fingerprints[$fingerprint] = true;
            $preparedRows[] = $prepared;
        }

        if ($errors !== []) {
            throw new QuizResponseImportException($errors);
        }

        if ($preparedRows === []) {
            if ($this->skippedCount > 0) {
                return;
            }

            throw new QuizResponseImportException([
                $this->error(2, 'File', 'File tidak memiliki baris data SKM.'),
            ]);
        }

        DB::transaction(function () use ($preparedRows): void {
            foreach ($preparedRows as $prepared) {
                if ($this->alreadyExists($prepared)) {
                    $this->skippedCount++;
                    continue;
                }

                QuizResponse::create($prepared);
                $this->insertedCount++;
            }
        });
    }

    private function validateHeadings(): array
    {
        $missing = array_values(array_diff(self::REQUIRED_HEADINGS, $this->headings));

        return array_map(
            fn (string $heading) => $this->error(1, $heading, 'Kolom wajib tidak ditemukan.'),
            $missing
        );
    }

    private function prepareRow(Collection $row, int $rowNumber, array $serviceLookup, array $lokusLookup): array
    {
        $errors = [];
        $date = $this->parseDate($row->get('tanggal_diisi'));
        if ($date === null) {
            $errors[] = $this->error($rowNumber, 'Tanggal Diisi', 'Gunakan tanggal Excel atau format YYYY-MM-DD.');
        }

        $gender = $this->upper($row->get('jenis_kelamin'));
        if (! in_array($gender, ['L', 'P'], true)) {
            $errors[] = $this->error($rowNumber, 'Jenis Kelamin', 'Nilai harus L atau P.');
        }

        $education = $this->upper($row->get('pendidikan'));
        if (! in_array($education, ['SD', 'SMP', 'SMA', 'S1', 'S2', 'S3'], true)) {
            $errors[] = $this->error($rowNumber, 'Pendidikan', 'Nilai harus SD, SMP, SMA, S1, S2, atau S3.');
        }

        $job = $this->clean($row->get('pekerjaan'));
        if ($job === '' || mb_strlen($job) > 255) {
            $errors[] = $this->error($rowNumber, 'Pekerjaan', 'Pekerjaan wajib diisi dan maksimal 255 karakter.');
        }

        $scores = [];
        for ($question = 1; $question <= 9; $question++) {
            $key = 'u'.$question;
            $value = $row->get($key);
            if (! is_numeric($value) || (int) $value != $value || (int) $value < 1 || (int) $value > 4) {
                $errors[] = $this->error($rowNumber, strtoupper($key), 'Nilai harus berupa bilangan bulat 1 sampai 4.');
                continue;
            }
            $scores['q'.$question] = (int) $value;
        }

        $serviceName = $this->clean($row->get('layanan'));
        $serviceKey = $this->lookupKey($serviceName);
        $serviceMatches = $serviceLookup[$serviceKey] ?? [];
        $service = count($serviceMatches) === 1 ? $serviceMatches[0] : null;
        if ($serviceName === '' || $serviceName === '-') {
            $errors[] = $this->error($rowNumber, 'Layanan', 'Layanan wajib diisi.');
        } elseif (count($serviceMatches) === 0) {
            $errors[] = $this->error($rowNumber, 'Layanan', 'Layanan tidak ditemukan.');
        } elseif (count($serviceMatches) > 1) {
            $errors[] = $this->error($rowNumber, 'Layanan', 'Nama layanan tidak unik pada data master.');
        } elseif ($this->user->roleId != 1 && (int) $this->user->id_service !== (int) $service->id) {
            $errors[] = $this->error($rowNumber, 'Layanan', 'Anda hanya dapat mengimpor data untuk layanan akun Anda.');
        }

        $lokusName = $this->clean($row->get('lokus'));
        $lokus = null;
        if ($lokusName !== '' && $lokusName !== '-') {
            $lokusMatches = $lokusLookup[$this->lookupKey($lokusName)] ?? [];
            if (count($lokusMatches) === 0) {
                $errors[] = $this->error($rowNumber, 'Lokus', 'Lokus tidak ditemukan.');
            } elseif (count($lokusMatches) > 1) {
                $errors[] = $this->error($rowNumber, 'Lokus', 'Nama lokus tidak unik pada data master.');
            } else {
                $lokus = $lokusMatches[0];
            }
        }

        if ($errors !== []) {
            return [null, $errors];
        }

        $suggestion = $this->clean($row->get('pesan_dan_saran'));

        return [[
            'gender' => $gender,
            'education' => $education,
            'job' => $job,
            'serviceId' => $service->id,
            'lokusId' => $lokus?->id,
            ...$scores,
            'suggestion' => $suggestion === '' ? '-' : $suggestion,
            'created_at' => $date->startOfDay(),
        ], []];
    }

    private function parseDate(mixed $value): ?Carbon
    {
        try {
            if ($value instanceof DateTimeInterface) {
                return Carbon::instance($value);
            }

            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject((float) $value));
            }

            $value = trim((string) $value);
            $date = Carbon::createFromFormat('!Y-m-d', $value);

            return $date !== false && $date->format('Y-m-d') === $value ? $date : null;
        } catch (Throwable) {
            return null;
        }
    }

    private function alreadyExists(array $prepared): bool
    {
        return QuizResponse::query()
            ->where('gender', $prepared['gender'])
            ->where('education', $prepared['education'])
            ->where('job', $prepared['job'])
            ->where('serviceId', $prepared['serviceId'])
            ->when(
                $prepared['lokusId'] === null,
                fn ($query) => $query->whereNull('lokusId'),
                fn ($query) => $query->where('lokusId', $prepared['lokusId'])
            )
            ->where('q1', $prepared['q1'])
            ->where('q2', $prepared['q2'])
            ->where('q3', $prepared['q3'])
            ->where('q4', $prepared['q4'])
            ->where('q5', $prepared['q5'])
            ->where('q6', $prepared['q6'])
            ->where('q7', $prepared['q7'])
            ->where('q8', $prepared['q8'])
            ->where('q9', $prepared['q9'])
            ->where('suggestion', $prepared['suggestion'])
            ->whereDate('created_at', $prepared['created_at']->format('Y-m-d'))
            ->exists();
    }

    private function fingerprint(array $prepared): string
    {
        $fingerprint = $prepared;
        $fingerprint['created_at'] = $prepared['created_at']->format('Y-m-d');

        return hash('sha256', json_encode($fingerprint));
    }

    private function buildLookup(Collection $models): array
    {
        $lookup = [];
        foreach ($models as $model) {
            $lookup[$this->lookupKey($model->name)][] = $model;
        }

        return $lookup;
    }

    private function lookupKey(mixed $value): string
    {
        return mb_strtoupper($this->clean($value));
    }

    private function upper(mixed $value): string
    {
        return mb_strtoupper($this->clean($value));
    }

    private function clean(mixed $value): string
    {
        return trim(preg_replace('/\s+/u', ' ', (string) ($value ?? '')) ?? '');
    }

    private function isEmptyRow(Collection $row): bool
    {
        return $row->every(fn ($value) => $this->clean($value) === '');
    }

    private function error(int $row, string $column, string $message): array
    {
        return compact('row', 'column', 'message');
    }
}

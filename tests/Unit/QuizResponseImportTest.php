<?php

use App\Exports\SurveyExport;
use App\Models\Lokus;
use App\Models\QuizResponse;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Maatwebsite\Excel\Excel as ExcelWriter;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    config()->set('database.default', 'sqlite');
    config()->set('database.connections.sqlite.database', ':memory:');
    DB::purge('sqlite');
    DB::reconnect('sqlite');

    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('username')->unique();
        $table->string('password');
        $table->integer('roleId');
        $table->integer('id_service')->nullable();
        $table->rememberToken();
        $table->timestamps();
    });

    Schema::create('services', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('is_active')->default(1);
        $table->timestamps();
    });

    Schema::create('lokus', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('is_active')->default(1);
        $table->timestamps();
    });

    Schema::create('quiz_responses', function (Blueprint $table) {
        $table->id();
        $table->string('gender');
        $table->string('education');
        $table->string('job');
        $table->integer('serviceId');
        $table->foreignId('lokusId')->nullable();
        for ($question = 1; $question <= 9; $question++) {
            $table->integer('q'.$question);
        }
        $table->text('suggestion');
        $table->timestamps();
    });
});

function surveyImportUpload(array $rows, ?array $headings = null): UploadedFile
{
    $headings ??= [
        'Tanggal Diisi',
        'Jenis Kelamin',
        'Pendidikan',
        'Pekerjaan',
        'U1',
        'U2',
        'U3',
        'U4',
        'U5',
        'U6',
        'U7',
        'U8',
        'U9',
        'Pesan dan Saran',
        'Layanan',
        'Lokus',
    ];

    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray($headings, null, 'A1');
    if ($rows !== []) {
        $sheet->fromArray($rows, null, 'A2');
    }

    $path = tempnam(sys_get_temp_dir(), 'skm-import-').'.xlsx';
    (new Xlsx($spreadsheet))->save($path);
    $spreadsheet->disconnectWorksheets();

    return new UploadedFile(
        $path,
        'import-skm.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null,
        true
    );
}

function validSurveyRow(string $service, string $lokus = '-'): array
{
    return [
        '2026-11-01',
        'P',
        'S1',
        'SWASTA',
        4,
        3,
        4,
        3,
        4,
        3,
        4,
        3,
        4,
        'Pelayanan baik',
        $service,
        $lokus,
    ];
}

it('requires authentication for the SKM import endpoints', function () {
    $this->get(route('survey.import.template'))->assertRedirect(route('login'));
    $this->post(route('survey.import.store'))->assertRedirect(route('login'));
});

it('downloads the SKM import template for an authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('survey.import.template'))
        ->assertOk()
        ->assertDownload('Template Import SKM.xlsx');
});

it('imports valid rows atomically and skips duplicate rows in the workbook', function () {
    $service = Service::create(['name' => 'Perizinan Bangunan', 'is_active' => 1]);
    $lokus = Lokus::create(['name' => 'MPP Bekasi', 'is_active' => 1]);
    $admin = User::factory()->create(['roleId' => 1]);
    $row = validSurveyRow(strtolower($service->name), strtoupper($lokus->name));

    $response = $this->actingAs($admin)->post(route('survey.import.store'), [
        'file' => surveyImportUpload([$row, $row]),
    ]);

    $response->assertRedirect()
        ->assertSessionHas('type', 'success')
        ->assertSessionHas('import_summary', ['inserted' => 1, 'skipped' => 1]);

    $this->assertDatabaseCount('quiz_responses', 1);
    $this->assertDatabaseHas('quiz_responses', [
        'gender' => 'P',
        'education' => 'S1',
        'job' => 'SWASTA',
        'serviceId' => $service->id,
        'lokusId' => $lokus->id,
        'q1' => 4,
        'q9' => 4,
        'suggestion' => 'Pelayanan baik',
    ]);
});

it('skips a row that already exists for the same survey date', function () {
    $service = Service::create(['name' => 'Perizinan Usaha', 'is_active' => 1]);
    $admin = User::factory()->create(['roleId' => 1]);

    QuizResponse::create([
        'gender' => 'P',
        'education' => 'S1',
        'job' => 'SWASTA',
        'serviceId' => $service->id,
        'lokusId' => null,
        'q1' => 4,
        'q2' => 3,
        'q3' => 4,
        'q4' => 3,
        'q5' => 4,
        'q6' => 3,
        'q7' => 4,
        'q8' => 3,
        'q9' => 4,
        'suggestion' => 'Pelayanan baik',
        'created_at' => '2026-11-01 14:25:00',
    ]);

    $this->actingAs($admin)
        ->post(route('survey.import.store'), [
            'file' => surveyImportUpload([validSurveyRow($service->name)]),
        ])
        ->assertSessionHas('import_summary', ['inserted' => 0, 'skipped' => 1]);

    $this->assertDatabaseCount('quiz_responses', 1);
});

it('accepts an Excel serial date and defaults an empty suggestion and locus', function () {
    $service = Service::create(['name' => 'Pelayanan Terpadu', 'is_active' => 1]);
    $admin = User::factory()->create(['roleId' => 1]);
    $row = validSurveyRow($service->name, '');
    $row[0] = ExcelDate::PHPToExcel(new DateTimeImmutable('2026-11-03'));
    $row[13] = '';

    $this->actingAs($admin)
        ->post(route('survey.import.store'), ['file' => surveyImportUpload([$row])])
        ->assertSessionHas('import_summary', ['inserted' => 1, 'skipped' => 0]);

    $this->assertDatabaseHas('quiz_responses', [
        'serviceId' => $service->id,
        'lokusId' => null,
        'suggestion' => '-',
        'created_at' => '2026-11-03 00:00:00',
    ]);
});

it('round trips the existing Data Survey export workbook', function () {
    $service = Service::create(['name' => 'Perizinan Lingkungan', 'is_active' => 1]);
    $lokus = Lokus::create(['name' => 'Gerai Utama', 'is_active' => 1]);
    $admin = User::factory()->create(['roleId' => 1]);

    QuizResponse::create([
        'gender' => 'L',
        'education' => 'SMA',
        'job' => 'WIRAUSAHA',
        'serviceId' => $service->id,
        'lokusId' => $lokus->id,
        'q1' => 1,
        'q2' => 2,
        'q3' => 3,
        'q4' => 4,
        'q5' => 1,
        'q6' => 2,
        'q7' => 3,
        'q8' => 4,
        'q9' => 1,
        'suggestion' => 'Pertahankan pelayanan',
        'created_at' => '2026-11-04 10:15:00',
    ]);

    $content = Excel::raw(
        new SurveyExport(QuizResponse::with(['service', 'lokus'])->get()),
        ExcelWriter::XLSX
    );
    QuizResponse::query()->delete();

    $path = tempnam(sys_get_temp_dir(), 'skm-roundtrip-').'.xlsx';
    file_put_contents($path, $content);
    $upload = new UploadedFile(
        $path,
        'Data Survey.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null,
        true
    );

    $this->actingAs($admin)
        ->post(route('survey.import.store'), ['file' => $upload])
        ->assertSessionHas('import_summary', ['inserted' => 1, 'skipped' => 0]);

    $this->assertDatabaseHas('quiz_responses', [
        'gender' => 'L',
        'education' => 'SMA',
        'serviceId' => $service->id,
        'lokusId' => $lokus->id,
        'q1' => 1,
        'q9' => 1,
        'suggestion' => 'Pertahankan pelayanan',
    ]);
});

it('rejects the entire workbook and reports row errors when one row is invalid', function () {
    $service = Service::create(['name' => 'Perizinan Reklame', 'is_active' => 1]);
    $admin = User::factory()->create(['roleId' => 1]);
    $invalidRow = validSurveyRow($service->name);
    $invalidRow[4] = 5;

    $response = $this->actingAs($admin)->post(route('survey.import.store'), [
        'file' => surveyImportUpload([validSurveyRow($service->name), $invalidRow]),
    ]);

    $response->assertRedirect()
        ->assertSessionHasErrors(['file'], null, 'import')
        ->assertSessionHas('import_errors', fn (array $errors) => collect($errors)->contains(
            fn (array $error) => $error['row'] === 3 && $error['column'] === 'U1'
        ));
    $this->assertDatabaseCount('quiz_responses', 0);
});

it('prevents a non-admin user from importing another service', function () {
    $assignedService = Service::create(['name' => 'Layanan A', 'is_active' => 1]);
    $otherService = Service::create(['name' => 'Layanan B', 'is_active' => 1]);
    $user = User::factory()->create([
        'roleId' => 2,
        'id_service' => $assignedService->id,
    ]);

    $this->actingAs($user)
        ->post(route('survey.import.store'), [
            'file' => surveyImportUpload([validSurveyRow($otherService->name)]),
        ])
        ->assertSessionHas('import_errors', fn (array $errors) => collect($errors)->contains(
            fn (array $error) => str_contains($error['message'], 'layanan akun Anda')
        ));

    $this->assertDatabaseCount('quiz_responses', 0);
});

it('rejects a workbook with a required heading missing', function () {
    $admin = User::factory()->create(['roleId' => 1]);
    $headings = [
        'Tanggal Diisi', 'Jenis Kelamin', 'Pendidikan', 'Pekerjaan',
        'U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9',
        'Pesan dan Saran', 'Lokus',
    ];

    $this->actingAs($admin)
        ->post(route('survey.import.store'), [
            'file' => surveyImportUpload([], $headings),
        ])
        ->assertSessionHas('import_errors', fn (array $errors) => collect($errors)->contains(
            fn (array $error) => $error['row'] === 1 && $error['column'] === 'layanan'
        ));
});

it('validates the uploaded file type', function () {
    $admin = User::factory()->create(['roleId' => 1]);

    $this->actingAs($admin)
        ->post(route('survey.import.store'), [
            'file' => UploadedFile::fake()->create('survey.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors(['file']);
});

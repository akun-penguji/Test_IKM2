
<table class="table table-striped" id="ikmtable">
    <thead>
        <tr>
            <th>Tanggal Diisi</th>
            <th>Jenis Kelamin</th>
            <th>Pendidikan</th>
            <th>Pekerjaan</th>
            <th>U1</th>
            <th>U2</th>
            <th>U3</th>
            <th>U4</th>
            <th>U5</th>
            <th>U6</th>
            <th>U7</th>
            <th>U8</th>
            <th>U9</th>
            <th>Pesan dan Saran</th>
            <th>Layanan</th>
            <th>Lokus</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $dataKey => $val)
            <tr>
                <td>{{ \Carbon\Carbon::parse($val->created_at)->format('Y-m-d') }}</td>
                <td>{{ $val->gender }}</td>
                <td>{{ $val->education }}</td>
                <td>{{ $val->job }}</td>
                <td>{{ $val->q1 }}</td>
                <td>{{ $val->q2 }}</td>
                <td>{{ $val->q3 }}</td>
                <td>{{ $val->q4 }}</td>
                <td>{{ $val->q5 }}</td>
                <td>{{ $val->q6 }}</td>
                <td>{{ $val->q7 }}</td>
                <td>{{ $val->q8 }}</td>
                <td>{{ $val->q9 }}</td>
                <td>{{ $val->suggestion }}</td>
                <td>{{ $val->service["name"] ?? '-' }}</td>
                <td>{{ $val->lokus["name"] ?? '-' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
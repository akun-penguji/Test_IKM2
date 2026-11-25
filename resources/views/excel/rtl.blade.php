<h4>IKM {{$service ? $service->name : 'Semua Layanan'}}</h4>
<h4>PERIODE {{\Carbon\Carbon::parse($period->start_at)->format('d M Y')}} s/d {{\Carbon\Carbon::parse($period->end_at)->format('d M Y')}}</h4>
<h4></h4>
<table class="table table-striped" id="ikmtable">
    <thead>
        <tr>
            <th>NO.</th>
            <th>Prioritas Unsur</th>
            <th>Nilai IKM</th>
            <th>Keluhan / Saran</th>
            <th>Program / Kegiatan</th>
            <th>Waktu (tahun)</th>
            <th>Penanggungjawab</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $key => $val)
        <tr>
            <td>{{ $key+1 }}</td>
            <td>{{ $val->unsur->name }}</td>
            <td>{{ $val->nilai }}</td>
            <td>{{ $val->saran }}</td>
            <td>{{ $val->program }}</td>
            <td>{{ $val->tahun }}</td>
            <td>{{ $val->pj }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
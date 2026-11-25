<h4>IKM {{$service ? $service->name : 'Semua Layanan'}}</h4>
<h4>PERIODE {{\Carbon\Carbon::parse($period->start_at)->format('d M Y')}} s/d {{\Carbon\Carbon::parse($period->end_at)->format('d M Y')}}</h4>
<h4></h4>
<table class="table table-striped" id="ikmtable">
    <thead>
        <tr>
            <th>NO. RES</th>
            <th colspan="9">NILAI UNSUR PELAYANAN</th>
            <th>KET</th>
        </tr>
        <tr>
            <th></th>
            <th>U1</th>
            <th>U2</th>
            <th>U3</th>
            <th>U4</th>
            <th>U5</th>
            <th>U6</th>
            <th>U7</th>
            <th>U8</th>
            <th>U9</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $key => $val)
        <tr>
            <td>{{ $key+1 }}</td>
            <td>{{ $val->q1 }}</td>
            <td>{{ $val->q2 }}</td>
            <td>{{ $val->q3 }}</td>
            <td>{{ $val->q4 }}</td>
            <td>{{ $val->q5 }}</td>
            <td>{{ $val->q6 }}</td>
            <td>{{ $val->q7 }}</td>
            <td>{{ $val->q8 }}</td>
            <td>{{ $val->q9 }}</td>
        </tr>
        @endforeach
        <tr>
            <td></td>
        </tr>
        <tr>
            <td>&Sigma;Nilai/Unsur</td>
            <td>{{ $calculation['sum']->q1 }}</td>
            <td>{{ $calculation['sum']->q2 }}</td>
            <td>{{ $calculation['sum']->q3 }}</td>
            <td>{{ $calculation['sum']->q4 }}</td>
            <td>{{ $calculation['sum']->q5 }}</td>
            <td>{{ $calculation['sum']->q6 }}</td>
            <td>{{ $calculation['sum']->q7 }}</td>
            <td>{{ $calculation['sum']->q8 }}</td>
            <td>{{ $calculation['sum']->q9 }}</td>
        </tr>
        <tr>
            <td>NRR/Unsur</td>
            <td>{{ $calculation['avg']->q1 }}</td>
            <td>{{ $calculation['avg']->q2 }}</td>
            <td>{{ $calculation['avg']->q3 }}</td>
            <td>{{ $calculation['avg']->q4 }}</td>
            <td>{{ $calculation['avg']->q5 }}</td>
            <td>{{ $calculation['avg']->q6 }}</td>
            <td>{{ $calculation['avg']->q7 }}</td>
            <td>{{ $calculation['avg']->q8 }}</td>
            <td>{{ $calculation['avg']->q9 }}</td>
        </tr>
        <tr>
            <td>NRR tertbg/Unsur</td>
            <td>{{ $calculation['avg_ttb']->q1 }}</td>
            <td>{{ $calculation['avg_ttb']->q2 }}</td>
            <td>{{ $calculation['avg_ttb']->q3 }}</td>
            <td>{{ $calculation['avg_ttb']->q4 }}</td>
            <td>{{ $calculation['avg_ttb']->q5 }}</td>
            <td>{{ $calculation['avg_ttb']->q6 }}</td>
            <td>{{ $calculation['avg_ttb']->q7 }}</td>
            <td>{{ $calculation['avg_ttb']->q8 }}</td>
            <td>{{ $calculation['avg_ttb']->q9 }}</td>
        </tr>
        <tr>
            <td rowspan="2" colspan="8">IKM Unit pelayanan</td>
            <td>*)</td>
            <td>**)</td>
        </tr>
        <tr>
            <td>{{ $calculation['sumAvg'] }}</td>
            <td>{{ $calculation['ikm'] }}</td>
        </tr>
        <tr>
            <td></td>
        </tr>
        <tr>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td colspan="4">Keterangan</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">U1 s.d. U9</td>
            <td colspan="3">Unsur-unsur pelayanan</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">NNR</td>
            <td colspan="3">Nilai rata-rata</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">IKM</td>
            <td colspan="3">Indeks Kepuasan Masyarakat</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">*)</td>
            <td colspan="3">Jumlah NRR IKM Tertimbang</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">**)</td>
            <td colspan="3">Jumlah NRR Tertimbang x 25</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">NRR Per Unsur terisi</td>
            <td colspan="3">Jumlah nilai per unsur dibagi jumlah kuesioner yang terisi</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">NRR tertimbang</td>
            <td colspan="3">NRR per unsur x 0,111</td>
        </tr>
    </tbody>
</table>
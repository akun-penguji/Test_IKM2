
<table class="table table-striped" id="ikmtable">
    <thead>
        <tr>
            <th>TABEL JUMLAH SKM MPP BULAN {{ $label }}</th>
        </tr>
        <tr>
            <th></th>
        </tr>
        <tr>
            <th></th>
        </tr>
        <tr>
            <th>NO</th>
            <th>Stand</th>
            <th colspan={{ count($days).'' }}>Tanggal</th>
            <th>Total</th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            @foreach ($days as $key => $val)
                <th>{{ $val }}</th>
            @endforeach
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            @foreach ($days as $key => $val)
                <th></th>
            @endforeach
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>Jumlah</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        @foreach ($services as $serviceKey => $serviceVal)
            <tr>
                <th>{{ $serviceVal->id }}</th>
                <th>{{ $serviceVal->name }}</th>
                @foreach ($days as $dayKey => $dayVal)
                    @php
                        $found = false;
                    @endphp
                    @foreach ($data as $dataKey => $dataVal)
                        @if ($dataVal->serviceId == $serviceVal->id && \Carbon\Carbon::parse($dataVal->day)->format('d') == $dayVal)
                            <td>{{ $dataVal->total }}</td>
                            @php
                                $found = true;
                                break;
                            @endphp
                        @endif
                    @endforeach
                    @if (!$found)
                        <td></td>
                    @endif
                @endforeach
                <th>{{ $data->where('serviceId', $serviceVal->id)->sum('total') }}</th>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <th></th>
            <th>Total</th>
            @foreach ($dailyTotals as $key => $val)
                <th>{{ $val }}</th>
            @endforeach
            <th>{{ $data->sum('total') }}</th>
        </tr>
    </tfoot>
</table>

# IoT

Wireless sensor networks (WSN) 的應用：

```
SELECT time_bucket('60 seconds', time)
      AS period,
    machine_id, avg(temperature) AS "avgT",
    min(temperature) AS "minT",
    max(temperature) AS "maxT"
  FROM measurements
  WHERE sensor_id = '...'
  GROUP BY ten_second
  ORDER BY ten_second DESC LIMIT 15;
```

即時數據分析：

```
SELECT
    time_bucket('60 seconds', time) AS period,
    sensor_id, avg(temperature)
  FROM measurements
  WHERE time > NOW () - interval '60 seconds'
  GROUP BY period, sensor_id
  ORDER BY period DESC, sensor_id;
```



 # Scalable

 * High write-through rate
 * Complex queries
 * 10+ billion rows per node
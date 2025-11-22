INSTALL httpfs;

LOAD httpfs;

INSTALL spatial;

LOAD spatial;

SET s3_region = 'us-west-2';

COPY(
  SELECT
    id,
    names.primary as name,
    class,
    geometry
  FROM
    read_parquet('s3://overturemaps-us-west-2/release/{{RELEASE}}/theme=transportation/type=segment/*', filename=true, hive_partitioning=1)
  WHERE
    bbox.xmin < 2.314 
    AND bbox.ymin < 48.882 
    AND bbox.xmax > 2.276 
    AND bbox.ymax > 48.865
) TO '{{FILE_NAME}}' WITH (FORMAT GDAL, DRIVER 'GeoJSON');
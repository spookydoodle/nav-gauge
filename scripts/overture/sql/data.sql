INSTALL httpfs;
LOAD httpfs;

INSTALL spatial;
LOAD spatial;

COPY (
    SELECT *
    FROM read_parquet('https://release-data.overturemaps.org/{{RELEASE}}/theme=transportation/type=segment/*.parquet')
) TO 'roads.ndjson' (FORMAT NDJSON);

COPY (
    SELECT *
    FROM read_parquet('https://release-data.overturemaps.org/{{RELEASE}}/theme=divisions/*.parquet')
) TO 'divisions.ndjson' (FORMAT NDJSON);

COPY (
    SELECT *
    FROM read_parquet('https://release-data.overturemaps.org/{{RELEASE}}/theme=water/type=river/*.parquet')
) TO 'rivers.ndjson' (FORMAT NDJSON);
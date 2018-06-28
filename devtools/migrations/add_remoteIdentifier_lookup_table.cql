CREATE TABLE remote_identifier (
    user_id uuid,
    identifier text,
    remote_id uuid,
    PRIMARY KEY (user_id, identifier)
);
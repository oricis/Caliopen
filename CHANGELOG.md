# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2017-07-02
### Added
- Participants suggestion API
- Basic user remote identities API
- API for attachment management during draft composition
- Backend for outbound email message build with attachements
- Basic privacy features extraction and pi computation when processing inbound email
- PI attribute added to user, public_key, contact, message entities
- Contact vcard import API and client implementation
- Contact book plugged with API

### Changed
- Remove any cassandra counters and secondary index usage
- Replace cassandra with scylladb in development stack
- Upgrade elasticsearch from 2.4 version to 5.x ones


## [0.1.0] - 2017-05-07
### Added
- Initial release
- Basic inbound email processing using NATS as message queue broker
- Contact API
- Message API 
- Timeline build on basic discussion structure
- development CLI with basic commands to manage storage and load fixtures
- docker compose development stack

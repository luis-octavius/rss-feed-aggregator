# gator

A TypeScript CLI RSS feed aggregator backed by PostgreSQL and Drizzle ORM.

## Requirements

- Node.js 20+
- npm
- PostgreSQL

## Installation

```bash
npm install
```

## Configuration

Create `~/.gatorconfig.json`:

```json
{
  "dbUrl": "postgres://USER:PASSWORD@localhost:5432/DB_NAME",
  "currentUserName": ""
}
```

## Database setup

Generate and apply migrations:

```bash
npm run generate
npm run migrate
```

## Run

```bash
npm run start <command> [args...]
```

## Commands

| Command | Args | Description |
| --- | --- | --- |
| `register` | `<name>` | Creates a user and sets it as current user |
| `login` | `<name>` | Sets an existing user as current user |
| `users` | none | Lists users (`(current)` is highlighted) |
| `reset` | none | Deletes all users |
| `addfeed` | `<name> <url>` | Creates a feed for the logged-in user and follows it |
| `feeds` | none | Lists all feeds and their owners |
| `follow` | `<url>` | Follows an existing feed |
| `following` | none | Lists feeds followed by the logged-in user |
| `unfollow` | `<url>` | Unfollows a feed |
| `agg` | `<time_between_reqs>` | Polls feeds repeatedly (e.g. `10s`, `1m`, `1h`) |
| `browse` | `[limit]` | Lists recent posts for the logged-in user |

## Examples

```bash
npm run start register luis
npm run start addfeed "Hacker News" "https://hnrss.org/frontpage"
npm run start agg 30s
```

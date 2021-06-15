# Citadel Backend

# Query methods

`GET` - we only use query (ex: `/api/v1/graph/{graph}/{interval}`) (receiving the information). In the case of some complex json objects `strinfgify()` and `encode()`

`POST` - json (create / action)

`PUT` - json (object change)

`DELETE` - if necessary, use json (object deletion)

# The usual answer from the server is the following:

<pre>
{
  "ok": true,
  "result": {}
}
</pre>

Use the the blank `outputOkSchema(Joi.object({}))`

<pre> {
  "ok": false,
  "code": 400031,
  "msg": "Invalid date.",
  "data": {}
}
</pre>

A sample error documenting file can be found in the docs folder at the root of the repository. The file is a list of custom errors, divided by status. If necessary, you can give an example of the field `data` for a specific error.

Field `code` is the HTTP code (400) in the first half and the specific error ID (031) in the second half. All possible errors (with the exception of general server errors marked 000) must be described in the file `ERRORS.md` in the root of the repository, and it is also recommended to list possible errors in the description of methods in the documentation.

## Documentation

Documentation is available at `/api/documentation`. Update `host` in `swagger.json`.

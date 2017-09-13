package objects

// params to pass to API to trigger elasticsearch search
type IndexSearch struct {
	Limit   int
	Offset  int
	Terms   map[string][]string
	User_id UUID
}

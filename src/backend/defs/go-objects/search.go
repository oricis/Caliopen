package objects

// params to pass to API to trigger an elasticsearch search
type IndexSearch struct {
	Limit   int
	Offset  int
	Terms   map[string][]string
	User_id UUID
}

type IndexResult struct {
	Total int64
	Hits  []*IndexHit
}

type IndexHit struct {
	Type       string
	Id         UUID
	Score      float64
	Highlights map[string][]string
	Document   interface{}
}

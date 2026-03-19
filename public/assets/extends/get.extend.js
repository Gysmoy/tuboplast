const GET = {}

let urlParams = new URLSearchParams(location.search);
[...urlParams].forEach(get => GET[get[0]] = get[1]);
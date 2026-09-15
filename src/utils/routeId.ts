// Last non-empty segment of a pathname: "/sort/bubble/" -> "bubble"
const routeId = (pathname: string) => pathname.split("/").filter(Boolean).pop() || "";

export default routeId;

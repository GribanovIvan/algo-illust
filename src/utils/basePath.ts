// Folder the app is served from, put into <base> by the bootstrap in index.html: "/asd/sort/bubble" -> "/asd/"
const basePath = () => new URL(document.baseURI).pathname;

export default basePath;

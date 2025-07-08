export default function middleware() {
  // Authentication disabled for testing
  console.log("Middleware: allowing all requests");
  return;
}

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-12 py-4">
      <div className="container mx-auto px-4 text-center text-gray-900 text-sm">
        &copy; {new Date().getFullYear()} ComplaintHub. All rights reserved.
      </div>
    </footer>
  );
}

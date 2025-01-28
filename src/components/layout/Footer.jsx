function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Status Pages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 
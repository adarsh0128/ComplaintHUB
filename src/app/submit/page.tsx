import ComplaintForm from '@/components/ComplaintForm';

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
          <p className="text-gray-600">
            We&apos;re here to help. Please provide details about your issue.
          </p>
        </div>
        
        <ComplaintForm />
      </div>
    </main>
  );
}

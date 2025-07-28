import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 28, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using PayPing ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            PayPing is a payment reminder and customer management platform that helps businesses automate their payment collection processes. The Service includes:
          </p>
          <ul>
            <li>Automated payment reminder systems</li>
            <li>Customer data management</li>
            <li>Payment tracking and analytics</li>
            <li>Template creation and customization</li>
            <li>Reporting and dashboard features</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul>
            <li>Send spam or unsolicited communications</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon intellectual property rights</li>
            <li>Transmit harmful or malicious content</li>
            <li>Interfere with the Service's functionality</li>
          </ul>

          <h2>5. Data and Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices. By using the Service, you consent to the collection and use of information as outlined in our Privacy Policy.
          </p>

          <h2>6. Payment Terms</h2>
          <p>
            If you choose a paid subscription plan:
          </p>
          <ul>
            <li>Fees are charged in advance on a monthly or annual basis</li>
            <li>No refunds are provided for partial months</li>
            <li>You may cancel your subscription at any time</li>
            <li>Price changes will be communicated 30 days in advance</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of PayPing and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall PayPing, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>9. Disclaimer</h2>
          <p>
            The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
          </p>
          <ul>
            <li>Excludes all representations and warranties relating to this Service</li>
            <li>Does not guarantee the accuracy, completeness, or timeliness of information</li>
            <li>Makes no warranties about the availability or functionality of the Service</li>
          </ul>

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <p className="mb-2"><strong>PayPing Support Team</strong></p>
            <p>Email: legal@payping.com</p>
            <p>Address: 123 Business St, Suite 100, San Francisco, CA 94102</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/privacy"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

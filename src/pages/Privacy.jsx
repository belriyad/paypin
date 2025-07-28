import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 28, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          
          <h2>1. Introduction</h2>
          <p>
            PayPing ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our payment reminder and customer management service.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We may collect the following personal information:</p>
          <ul>
            <li>Name and contact information (email, phone, address)</li>
            <li>Company information and business details</li>
            <li>Payment and billing information</li>
            <li>Account credentials and authentication data</li>
          </ul>

          <h3>Customer Data</h3>
          <p>When you use our Service, you may upload customer information including:</p>
          <ul>
            <li>Customer names and contact details</li>
            <li>Payment history and invoice information</li>
            <li>Communication preferences</li>
            <li>Transaction records</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information about your use of our Service:</p>
          <ul>
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information and unique identifiers</li>
            <li>Usage patterns and feature interactions</li>
            <li>Performance metrics and error reports</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>Providing and maintaining our Service</li>
            <li>Processing payments and managing accounts</li>
            <li>Sending automated payment reminders</li>
            <li>Improving our Service and developing new features</li>
            <li>Communicating with you about updates and support</li>
            <li>Ensuring security and preventing fraud</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:</p>
          
          <h3>Service Providers</h3>
          <p>We may share information with trusted third-party service providers who assist us in:</p>
          <ul>
            <li>Cloud hosting and data storage</li>
            <li>Payment processing</li>
            <li>Email and SMS delivery</li>
            <li>Analytics and monitoring</li>
            <li>Customer support services</li>
          </ul>

          <h3>Legal Requirements</h3>
          <p>We may disclose information when required by law or to:</p>
          <ul>
            <li>Comply with legal processes or government requests</li>
            <li>Protect our rights and property</li>
            <li>Ensure user safety and security</li>
            <li>Investigate potential violations of our Terms</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your information:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Access controls and authentication systems</li>
            <li>Regular security assessments and updates</li>
            <li>Employee training on data protection</li>
            <li>Incident response and breach notification procedures</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. We may retain certain information for longer periods when required by law or for legitimate business purposes.
          </p>

          <h2>7. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>

          <h2>8. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Analyze usage patterns and improve our Service</li>
            <li>Provide personalized content and features</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
          <p>You can control cookie settings through your browser preferences.</p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers, including:
          </p>
          <ul>
            <li>Standard contractual clauses</li>
            <li>Adequacy decisions by relevant authorities</li>
            <li>Certification schemes and codes of conduct</li>
          </ul>

          <h2>10. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <p className="mb-2"><strong>PayPing Privacy Team</strong></p>
            <p>Email: privacy@payping.com</p>
            <p>Address: 123 Business St, Suite 100, San Francisco, CA 94102</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          <h2>13. GDPR Compliance</h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>Right to withdraw consent at any time</li>
            <li>Right to object to processing for direct marketing</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
            <li>Right to restrict processing in certain circumstances</li>
          </ul>

        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/terms"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Terms and Conditions
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

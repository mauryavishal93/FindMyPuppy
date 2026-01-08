import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => (
  <div className="absolute inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-4 px-4 animate-fade-in overflow-hidden">
    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl relative max-h-[calc(90vh-2rem)] flex flex-col border-4 border-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Privacy Policy</h3>
            <p className="text-xs text-slate-600 font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-slate-600 flex items-center justify-center transition-colors shadow-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-4 hide-scrollbar">
        <div className="space-y-6 prose prose-sm max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
            <h4 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
              <i className="fas fa-shield-alt text-blue-500"></i>
              Introduction
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Welcome to <strong>FindMyPuppy</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a safe experience for all users, especially children. This Privacy Policy explains how we collect, use, store, and protect information when you use our mobile application and website (collectively, the "Service").
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-2">
              <strong>COPPA Compliance:</strong> This app is designed to be COPPA-compliant and suitable for children under 13. We take children's privacy seriously and have implemented measures to protect their information.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-database text-indigo-500"></i>
              1. Information We Collect
            </h4>
            <div className="space-y-3">
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <h5 className="font-bold text-slate-800 mb-2">Account Information</h5>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                  <li><strong>Username:</strong> Required to create an account and play the game</li>
                  <li><strong>Email Address:</strong> Required for account creation (for users 13+)</li>
                  <li><strong>Password:</strong> Encrypted and stored securely (never stored in plain text)</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <h5 className="font-bold text-slate-800 mb-2">Game Data</h5>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                  <li>Game progress (levels completed, scores, hints used)</li>
                  <li>Points and achievements</li>
                  <li>Purchase history (for in-app purchases)</li>
                  <li>Theme preferences</li>
                </ul>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <h5 className="font-bold text-slate-800 mb-2">Technical Information</h5>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                  <li>Device type and operating system</li>
                  <li>App version</li>
                  <li>Usage statistics (game sessions, time played)</li>
                  <li>IP address (for security and analytics purposes)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-cogs text-green-500"></i>
              2. How We Use Information
            </h4>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside ml-2">
                <li>To create and manage user accounts</li>
                <li>To provide game features and functionality</li>
                <li>To save game progress and sync across devices</li>
                <li>To process in-app purchases securely</li>
                <li>To improve our services and fix bugs</li>
                <li>To send important account notifications (password resets, etc.)</li>
                <li>To prevent fraud and ensure security</li>
                <li><strong>We do NOT use personal information for marketing purposes</strong></li>
              </ul>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-lock text-red-500"></i>
              3. Data Storage and Security
            </h4>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h5 className="font-bold text-slate-800 mb-2">Encryption</h5>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                All passwords are encrypted using industry-standard <strong>bcrypt hashing</strong> before storage. Passwords are never stored in plain text and cannot be retrieved or viewed by anyone, including our staff.
              </p>
              <h5 className="font-bold text-slate-800 mb-2">Storage</h5>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                <li>Data is stored on secure servers hosted by MongoDB Atlas</li>
                <li>All data transmission uses SSL/TLS encryption</li>
                <li>We use secure authentication methods</li>
                <li>Regular security audits and updates</li>
              </ul>
            </div>
          </div>

          {/* Children's Privacy (COPPA) */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-child text-pink-500"></i>
              4. Children's Privacy (COPPA Compliance)
            </h4>
            <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-bold">
                FindMyPuppy is designed to be COPPA-compliant and safe for children under 13.
              </p>
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-slate-800 mb-2">Parental Consent</h5>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                    <li>For users under 13, we require <strong>verifiable parental consent</strong> before collecting any personal information</li>
                    <li>Parents can review, modify, or delete their child's information at any time</li>
                    <li>Parents can request account deletion by contacting us</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-2">Limited Data Collection</h5>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2">
                    <li>We only collect minimal information necessary for gameplay</li>
                    <li>No location tracking or geolocation data</li>
                    <li>No social media integration for children under 13</li>
                    <li>No personalized advertising based on personal information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-puzzle-piece text-orange-500"></i>
              5. Third-Party Services
            </h4>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                We use the following third-party services that may collect information:
              </p>
              <div className="space-y-2">
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Payment Processing: Razorpay</h5>
                  <p className="text-xs text-slate-600">Payment information is processed securely by Razorpay and never stored by us.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Authentication: Google Sign-In</h5>
                  <p className="text-xs text-slate-600">Optional Google sign-in (users 13+) is handled by Google's secure authentication system.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Advertising: Google AdSense</h5>
                  <p className="text-xs text-slate-600">We may show age-appropriate ads. AdSense may collect anonymous usage data for ad personalization.</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Data Storage: MongoDB Atlas</h5>
                  <p className="text-xs text-slate-600">Game data is stored securely on MongoDB's cloud servers with encryption.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-share-alt text-teal-500"></i>
              6. Data Sharing and Sale
            </h4>
            <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-bold text-lg">
                <i className="fas fa-exclamation-triangle text-teal-600 mr-2"></i>
                We DO NOT sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                We may share information only in the following limited circumstances:
              </p>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2 mt-2">
                <li>With service providers who help us operate the app (payment processors, hosting services) under strict confidentiality agreements</li>
                <li>If required by law or to protect our legal rights</li>
                <li>In case of a business transfer (merger, acquisition) with prior notice</li>
                <li>With your explicit consent</li>
              </ul>
            </div>
          </div>

          {/* Data Retention */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-clock text-purple-500"></i>
              7. Data Retention
            </h4>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside ml-2">
                <li>We retain account information as long as your account is active</li>
                <li>You can delete your account at any time, and we will delete your personal information within 30 days</li>
                <li>Some information may be retained for legal or security purposes as required by law</li>
                <li>Game statistics and scores may be retained in anonymized form for analytics</li>
              </ul>
            </div>
          </div>

          {/* Account Deletion */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-trash-alt text-red-500"></i>
              8. Your Rights and Account Deletion
            </h4>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                You have the right to:
              </p>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside ml-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Modify:</strong> Update or correct your account information</li>
                <li><strong>Delete:</strong> Request deletion of your account and all associated data</li>
                <li><strong>Opt-out:</strong> Disable certain features or data collection</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
              </ul>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                To exercise these rights, contact us at the email address provided below.
              </p>
            </div>
          </div>

          {/* GDPR/CCPA Compliance */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-globe text-blue-500"></i>
              9. GDPR and CCPA Compliance
            </h4>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                We comply with applicable data protection laws, including:
              </p>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside ml-2">
                <li><strong>GDPR (EU):</strong> European users have rights including access, rectification, erasure, and data portability</li>
                <li><strong>CCPA (California):</strong> California residents have rights to know, delete, and opt-out of sale of personal information</li>
                <li><strong>COPPA (US):</strong> Special protections for children under 13 with parental consent requirements</li>
              </ul>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed font-bold">
                If you are in the EU, UK, or California, you have additional rights. Please contact us to exercise them.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-envelope text-indigo-500"></i>
              10. Contact Us
            </h4>
            <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
              <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                If you have questions about this Privacy Policy, wish to exercise your rights, or need to contact us regarding your child's account, please reach out:
              </p>
              <div className="bg-white rounded-lg p-3 border border-indigo-100 mt-3">
                <p className="text-sm font-bold text-slate-800 mb-1">Developer:</p>
                <p className="text-sm text-slate-700">MVTechnology</p>
                <p className="text-sm font-bold text-slate-800 mt-3 mb-1">Email:</p>
                <p className="text-sm text-slate-700">
                  <a href="mailto:findmypuppys@gmail.com" className="text-indigo-600 hover:underline font-medium">
                    findmypuppys@gmail.com
                  </a>
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  For parental consent requests, account deletions, or privacy concerns, please include your username and account information in your email.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div>
            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-edit text-gray-500"></i>
              11. Changes to This Policy
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of significant changes by:
              </p>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside ml-2 mt-2">
                <li>Updating the "Last Updated" date at the top of this policy</li>
                <li>Posting a notice in the app</li>
                <li>Sending an email notification for material changes</li>
              </ul>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                Continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center border-t border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} MVTechnology. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              This Privacy Policy is effective as of the date listed above.
            </p>
          </div>

        </div>
      </div>

      {/* Footer Button */}
      <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50">
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <i className="fas fa-check mr-2"></i>
          I Understand
        </button>
      </div>
    </div>
  </div>
);


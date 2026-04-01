// 'use client'

// import { X } from 'lucide-react'
// import { useState } from 'react'

// interface AuthPopupProps {
//   isOpen: boolean
//   onClose: () => void
//   message?: string
// }

// export default function AuthPopup({ isOpen, onClose, message = 'Sign in or login to continue' }: AuthPopupProps) {
//   const [isSignUp, setIsSignUp] = useState(false)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   if (!isOpen) return null

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // In a real app, this would handle authentication
//     // For now, we'll just close the popup
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">
//             {isSignUp ? 'Sign Up' : 'Sign In'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-4">
//           <p className="text-sm text-gray-600">{message}</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your@email.com"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
//             >
//               {isSignUp ? 'Create Account' : 'Sign In'}
//             </button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">OR</span>
//             </div>
//           </div>

//           <p className="text-center text-sm text-gray-600">
//             {isSignUp ? 'Already have an account?' : "Don't have an account?"}
//             <button
//               onClick={() => setIsSignUp(!isSignUp)}
//               className="ml-1 text-green-600 font-semibold hover:text-green-700"
//             >
//               {isSignUp ? 'Sign In' : 'Sign Up'}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function TransactionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full flex-1 flex flex-col">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/Accounts" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Financial history and logs</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
                    <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                        <Construction className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Under Development</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        The transaction history module is currently being built. Check back soon for detailed financial logs and audit trails.
                    </p>
                    <div className="mt-8">
                        <Link href="/Accounts" className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

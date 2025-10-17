import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface LoginMethod {
    name: string;
    users: number;
    percentage: number;
    icon: React.ReactNode;
}
interface LoginStats {
    totalLogins: number;
    googleLogin: {
        count: number;
        percentage: number;
    };
    githubLogin: {
        count: number;
        percentage: number;
    };
    manualLogin: {
        count: number;
        percentage: number;
    };
}

const LoginStatistics: React.FC = () => {
    const [loginStats, setLoginStats] = useState<LoginStats | null>(null);
    const [loading, setLoading] = useState(true);
    const totalLogins = loginStats?.totalLogins || 0;

    useEffect(() => {
        const fetchLoginStats = async () => {
            try {
                const response = await fetch('/api/admin/login-statistics', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    setLoginStats(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch login statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoginStats();
    }, []);

    const loginMethods: LoginMethod[] = loginStats ? [
        {
            name: 'Google Login',
            users: loginStats.googleLogin.count,
            percentage: loginStats.googleLogin.percentage,
            icon: <Image src={'/images/admin/google-icon.svg'} width={34} height={34} alt='Google' />
        },
        {
            name: 'Manual Login',
            users: loginStats.manualLogin.count,
            percentage: loginStats.manualLogin.percentage,
            icon: <Image src={'/images/admin/user-icon.svg'} width={34} height={34} alt='Google' />

        },
        {
            name: 'Github Login',
            users: loginStats.githubLogin.count,
            percentage: loginStats.githubLogin.percentage,
            icon: <Image src={'/images/admin/github-icon.svg'} width={34} height={34} alt='Google' />

        }
    ]: [];

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Login Statistics</h2>
                <p className="text-sm text-gray-500">Total Logins: {totalLogins.toLocaleString()}</p>
            </div>

            {/* Statistics List */}
            <div className="space-y-2">
                {loginMethods.map((method, index) => (
                    <div key={index} className="flex items-center border border-gray-200 p-6 rounded-xl justify-between py-4">
                        {/* Left side - Icon and text */}
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {method.icon}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {method.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {method.users.toLocaleString()} users
                                </p>
                            </div>
                        </div>

                        {/* Right side - Percentage */}
                        <div className="flex-shrink-0 ml-4">
                            <span className="text-lg font-semibold text-gray-900">
                                {method.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoginStatistics;
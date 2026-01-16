import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Building, Shield, Calendar, MapPin } from "lucide-react";
import avatar from "/images/user.jpg";

const Profile: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 bg-slate-50 min-h-screen transition-all duration-300">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information and account settings</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* LEFT COLUMN - AVATAR & QUICK INFO */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 p-1 shadow-lg">
                                <img
                                    src={avatar}
                                    alt="User avatar"
                                    className="w-full h-full rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800">{user?.firstName} {user?.lastName}</h2>
                        <p className="text-teal-600 font-medium mb-4">{user?.companyName}</p>

                        <div className="w-full pt-6 border-t border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={18} className="text-slate-400" />
                                <span className="text-sm">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Building size={18} className="text-slate-400" />
                                <span className="text-sm">{user?.companyName} Headquarters</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin size={18} className="text-slate-400" />
                                <span className="text-sm">New York, USA</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-lg border border-slate-700 text-white">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-teal-400" />
                            Account Security
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">Your account is secured with end-to-end encryption and two-factor authentication.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all border border-white/10">
                            Update Password
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN - DETAILED INFO */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                            <button className="px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                Edit Details
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                                    {user?.firstName}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                                    {user?.lastName}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 italic">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                                    +1 (555) 000-0000
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-8">Business Details</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                                    {user?.companyName}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                                    Administrator
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">User ID</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-mono text-xs border border-slate-100 overflow-hidden text-ellipsis">
                                    {user?.userId}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</label>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    January 2026
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

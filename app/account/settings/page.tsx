"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Eye, EyeOff, Globe, Lock, Save, Shield, User } from "lucide-react";

import { requestBackend } from "@/lib/backend";

const SETTINGS_KEY = "siliconbay-account-settings";

type ProfileForm = {
    firstName: string;
    lastName: string;
    email: string;
};

type SecurityForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type PreferenceForm = {
    orderUpdates: boolean;
    promotionalEmails: boolean;
    newsletter: boolean;
    smsNotifications: boolean;
    profileVisibility: boolean;
    activityTracking: boolean;
    dataSharing: boolean;
    language: string;
    timeZone: string;
    currency: string;
    dateFormat: string;
};

const defaultPreferences: PreferenceForm = {
    orderUpdates: true,
    promotionalEmails: true,
    newsletter: false,
    smsNotifications: false,
    profileVisibility: true,
    activityTracking: true,
    dataSharing: false,
    language: "English",
    timeZone: "GMT+5:30 (Sri Lanka)",
    currency: "LKR (Rs)",
    dateFormat: "YYYY-MM-DD",
};

const Settings = () => {
    const [profile, setProfile] = useState<ProfileForm>({ firstName: "", lastName: "", email: "" });
    const [security, setSecurity] = useState<SecurityForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [preferences, setPreferences] = useState<PreferenceForm>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (!stored) return defaultPreferences;
            return { ...defaultPreferences, ...JSON.parse(stored) };
        } catch {
            return defaultPreferences;
        }
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingSecurity, setSavingSecurity] = useState(false);

        useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await requestBackend<{ user?: Record<string, unknown> }>("/users/me");
                const user = response.user ?? {};
                setProfile({
                    firstName: String(user.firstName ?? ""),
                    lastName: String(user.lastName ?? ""),
                    email: String(user.email ?? ""),
                });
            } catch {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser) as Record<string, unknown>;
                        setProfile({
                            firstName: String(parsedUser.firstName ?? ""),
                            lastName: String(parsedUser.lastName ?? ""),
                            email: String(parsedUser.email ?? ""),
                        });
                    } catch {
                        setProfile({ firstName: "", lastName: "", email: "" });
                    }
                }
            }
        };

        loadProfile();
    }, []);

    const preferenceRows = useMemo(
        () => [
            {
                label: "Order Updates",
                description: "Receive notifications about your order status",
                checked: preferences.orderUpdates,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, orderUpdates: checked })),
            },
            {
                label: "Promotional Emails",
                description: "Receive special offers and deals",
                checked: preferences.promotionalEmails,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, promotionalEmails: checked })),
            },
            {
                label: "Newsletter",
                description: "Weekly newsletter with tips and updates",
                checked: preferences.newsletter,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, newsletter: checked })),
            },
            {
                label: "SMS Notifications",
                description: "Get text messages for important updates",
                checked: preferences.smsNotifications,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, smsNotifications: checked })),
            },
            {
                label: "Profile Visibility",
                description: "Make your profile visible to other users",
                checked: preferences.profileVisibility,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, profileVisibility: checked })),
            },
            {
                label: "Activity Tracking",
                description: "Allow us to track activity for personalized recommendations",
                checked: preferences.activityTracking,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, activityTracking: checked })),
            },
            {
                label: "Data Sharing",
                description: "Share your data with third-party partners",
                checked: preferences.dataSharing,
                onChange: (checked: boolean) => setPreferences((current) => ({ ...current, dataSharing: checked })),
            },
        ],
        [preferences]
    );

    const saveProfile = async () => {
        setSavingProfile(true);
        setStatusMessage(null);

        try {
            const response = await requestBackend<{ user?: Record<string, unknown>; message?: string }>("/users/me", {
                method: "PUT",
                body: JSON.stringify(profile),
            });
            const nextProfile = response.user ?? profile;
            localStorage.setItem("user", JSON.stringify(nextProfile));
            setProfile({
                firstName: String(nextProfile.firstName ?? ""),
                lastName: String(nextProfile.lastName ?? ""),
                email: String(nextProfile.email ?? ""),
            });
            setStatusMessage(response.message ?? "Profile updated successfully.");
        } catch {
            setStatusMessage("Unable to update the profile right now.");
        } finally {
            setSavingProfile(false);
        }
    };

    const saveSecurity = async () => {
        setSavingSecurity(true);
        setStatusMessage(null);

        try {
            const response = await requestBackend<{ message?: string }>("/users/me", {
                method: "PUT",
                body: JSON.stringify(security),
            });
            setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setStatusMessage(response.message ?? "Password updated successfully.");
        } catch {
            setStatusMessage("Unable to update the password right now.");
        } finally {
            setSavingSecurity(false);
        }
    };

    const savePreferences = () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences));
        setStatusMessage("Preferences saved in this browser.");
    };

    const downloadData = () => {
        const exportData = {
            profile,
            preferences,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "siliconbay-account-data.json";
        anchor.click();
        URL.revokeObjectURL(url);
        setStatusMessage("Account data export started.");
    };

    return (
        <div className="flex-1 space-y-6">
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your profile, password, and browser-saved preferences</p>
            </div>

            {statusMessage ? <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">{statusMessage}</div> : null}

            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Profile Information</h2>
                        <p className="text-sm text-gray-600">Update the details used across the account area</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} type="email" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={saveProfile} disabled={savingProfile} className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {savingProfile ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Lock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Security</h2>
                        <p className="text-sm text-gray-600">Change your password when you need to</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input value={security.currentPassword} onChange={(event) => setSecurity((current) => ({ ...current, currentPassword: event.target.value }))} type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10" />
                                <button type="button" onClick={() => setShowCurrentPassword((current) => !current)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input value={security.newPassword} onChange={(event) => setSecurity((current) => ({ ...current, newPassword: event.target.value }))} type="password" placeholder="Enter new password" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input value={security.confirmPassword} onChange={(event) => setSecurity((current) => ({ ...current, confirmPassword: event.target.value }))} type="password" placeholder="Confirm new password" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={saveSecurity} disabled={savingSecurity} className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {savingSecurity ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        <p className="text-sm text-gray-600">These preferences are stored locally until backend support is added</p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {preferenceRows.slice(0, 4).map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked={item.checked} onChange={(event) => item.onChange(event.target.checked)} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button onClick={savePreferences} className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Language & Region</h2>
                        <p className="text-sm text-gray-600">Store regional settings in this browser</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <select value={preferences.language} onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value }))} className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Chinese</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                            <select value={preferences.timeZone} onChange={(event) => setPreferences((current) => ({ ...current, timeZone: event.target.value }))} className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>GMT-5 (Eastern Time)</option>
                                <option>GMT-6 (Central Time)</option>
                                <option>GMT-7 (Mountain Time)</option>
                                <option>GMT-8 (Pacific Time)</option>
                                <option>GMT+5:30 (Sri Lanka)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select value={preferences.currency} onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))} className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>JPY (¥)</option>
                                <option>LKR (Rs)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                            <select value={preferences.dateFormat} onChange={(event) => setPreferences((current) => ({ ...current, dateFormat: event.target.value }))} className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>MM/DD/YYYY</option>
                                <option>DD/MM/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={downloadData} className="px-6 py-2 border hover:bg-gray-50">
                            Download My Data
                        </button>
                        <button onClick={savePreferences} className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Privacy & Data</h2>
                        <p className="text-sm text-gray-600">These controls are stored locally for now</p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {preferenceRows.slice(4).map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked={item.checked} onChange={(event) => item.onChange(event.target.checked)} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
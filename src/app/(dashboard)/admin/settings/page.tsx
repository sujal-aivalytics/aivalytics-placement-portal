'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
    return (
        <div className="space-y-6 p-6 md:p-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage system preferences and configurations
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" placeholder="Admin User" defaultValue="Admin" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="admin@example.com" disabled />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl">Save Profile</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                            </div>
                            <Button variant="outline">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Password</Label>
                                <p className="text-sm text-muted-foreground">Change your password</p>
                            </div>
                            <Button variant="outline">Update</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Notification settings are managed globally.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { format } from "path";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fats: undefined,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/clients/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        setUserData(data);

        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          calories: data.targetGoals?.calories,
          protein: data.targetGoals?.macros?.protein,
          carbs: data.targetGoals?.macros?.carbs,
          fats: data.targetGoals?.macros?.fats,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePersonalDataSubmimt = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/clients/updatePersonalData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update personal data");
      }
      const updatedData = await response.json();
      setUserData(updatedData);
    } catch (err) {
      console.error("Error updating personal data:", err);
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (Loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt="Profile picture"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Change Photo
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="goals">Fitness Goals</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePersonalDataSubmimt}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p>{formData.email}</p>
                </div>
                <Button>Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Goals</CardTitle>
                <CardDescription>
                  Set your nutrition and fitness targets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Daily Calorie Target</Label>
                  <Input id="calories"
                  type="number" 
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Macronutrient Targets</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input id="protein" 
                      type="number" 
                      value={formData.protein}
                      onChange={(e) => setFormData({...formData, protein: Number(e.target.value) })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input id="carbs" 
                      type="number" 
                      value={formData.carbs}
                      onChange={(e) => setFormData({...formData, carbs: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fats">Fats (g)</Label>
                      <Input id="fats" 
                      type="number" 
                      value={formData.fats}
                      onChange={(e) => setFormData({...formData, fats: Number(e.target.value) })} />
                    </div>
                  </div>
                </div>
                <Button>Save Goals</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (user: { id: string; name: string; email: string; role: "demandeur" | "valideur" }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (role: "demandeur" | "valideur") => {
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulation d'authentification - en production, ceci serait géré par Supabase
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || email.split("@")[0],
        email,
        role,
      };
      
      onLogin(user);
      setLoading(false);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.name}`,
      });
    }, 1000);
  };

  const handleRegister = async (role: "demandeur" | "valideur") => {
    if (!email || !password || !name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulation d'inscription - en production, ceci serait géré par Supabase
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };
      
      onLogin(user);
      setLoading(false);
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${user.name}`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">VisitManager</h1>
          <p className="text-muted-foreground mt-2">Gestion des visites et des salles</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Accédez à votre espace de gestion</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleLogin("demandeur")} 
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Demandeur
                  </Button>
                  <Button 
                    onClick={() => handleLogin("valideur")} 
                    disabled={loading}
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Valideur
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Mot de passe</Label>
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleRegister("demandeur")} 
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Demandeur
                  </Button>
                  <Button 
                    onClick={() => handleRegister("valideur")} 
                    disabled={loading}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Valideur
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitRequestForm } from "@/components/visits/VisitRequestForm";
import { VisitRequestList } from "@/components/visits/VisitRequestList";
import { 
  CalendarDays, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  LogOut,
  Plus,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  role: "demandeur" | "valideur";
}

interface VisitRequest {
  id: string;
  requesterName: string;
  numberOfPeople: number;
  visitDate: Date | null;
  startTime: string;
  endTime: string;
  isClient: boolean;
  clientNumber: string;
  needsCatering: boolean;
  location: "Lepic" | "Fromentin" | "";
  deliveryTime: string;
  allergies: string;
  clientReference: string;
  comments: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  requesterId: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [activeTab, setActiveTab] = useState(user.role === "demandeur" ? "new-request" : "manage-requests");

  // Charger les demandes depuis le localStorage (simulation de base de données)
  useEffect(() => {
    const savedRequests = localStorage.getItem("visitRequests");
    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests).map((req: any) => ({
        ...req,
        visitDate: req.visitDate ? new Date(req.visitDate) : null,
        createdAt: new Date(req.createdAt),
      }));
      setRequests(parsedRequests);
    }
  }, []);

  // Sauvegarder les demandes dans le localStorage
  const saveRequests = (newRequests: VisitRequest[]) => {
    localStorage.setItem("visitRequests", JSON.stringify(newRequests));
    setRequests(newRequests);
  };

  const handleNewRequest = (requestData: any) => {
    const newRequest: VisitRequest = {
      id: Math.random().toString(36).substr(2, 9),
      ...requestData,
      status: "pending",
      createdAt: new Date(),
      requesterId: user.id,
    };

    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);
  };

  const handleStatusUpdate = (requestId: string, status: "approved" | "rejected") => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status } : req
    );
    saveRequests(updatedRequests);
  };

  const userRequests = requests.filter(req => req.requesterId === user.id);
  const pendingRequests = requests.filter(req => req.status === "pending");
  const approvedRequests = requests.filter(req => req.status === "approved");
  const rejectedRequests = requests.filter(req => req.status === "rejected");

  const stats = [
    {
      title: "Demandes en attente",
      value: pendingRequests.length,
      icon: Clock,
      color: "text-pending",
      bgColor: "bg-pending/10",
    },
    {
      title: "Demandes approuvées",
      value: approvedRequests.length,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Demandes refusées",
      value: rejectedRequests.length,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Total des demandes",
      value: requests.length,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">VisitManager</h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenue, {user.name} • 
                  <Badge variant={user.role === "valideur" ? "default" : "secondary"} className="ml-2">
                    {user.role === "valideur" ? "Valideur" : "Demandeur"}
                  </Badge>
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-md bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {user.role === "demandeur" && (
              <>
                <TabsTrigger value="new-request" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle demande
                </TabsTrigger>
                <TabsTrigger value="my-requests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Mes demandes
                </TabsTrigger>
              </>
            )}
            {user.role === "valideur" && (
              <>
                <TabsTrigger value="manage-requests" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Demandes en attente
                </TabsTrigger>
                <TabsTrigger value="all-requests" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Toutes les demandes
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {user.role === "demandeur" && (
            <>
              <TabsContent value="new-request" className="mt-6">
                <VisitRequestForm onSubmit={handleNewRequest} userName={user.name} />
              </TabsContent>

              <TabsContent value="my-requests" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Mes demandes de visite</CardTitle>
                    <CardDescription>
                      Consultez le statut de vos demandes de visite
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VisitRequestList 
                      requests={userRequests} 
                      showActions={false} 
                      userRole="demandeur"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {user.role === "valideur" && (
            <>
              <TabsContent value="manage-requests" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Demandes en attente de validation</CardTitle>
                    <CardDescription>
                      Approuvez ou refusez les demandes de visite
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VisitRequestList 
                      requests={pendingRequests} 
                      showActions={true} 
                      onStatusUpdate={handleStatusUpdate}
                      userRole="valideur"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all-requests" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Toutes les demandes</CardTitle>
                    <CardDescription>
                      Historique complet des demandes de visite
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VisitRequestList 
                      requests={requests} 
                      showActions={false} 
                      userRole="valideur"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};
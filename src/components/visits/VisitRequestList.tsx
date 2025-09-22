import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Users, 
  MapPin,
  Utensils,
  User,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

interface VisitRequestListProps {
  requests: VisitRequest[];
  showActions: boolean;
  onStatusUpdate?: (requestId: string, status: "approved" | "rejected") => void;
  userRole: "demandeur" | "valideur";
}

export const VisitRequestList = ({ 
  requests, 
  showActions, 
  onStatusUpdate,
  userRole 
}: VisitRequestListProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-pending/10 text-pending border-pending/20">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuvée
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Refusée
          </Badge>
        );
      default:
        return null;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Aucune demande
        </h3>
        <p className="text-sm text-muted-foreground">
          {userRole === "demandeur" 
            ? "Vous n'avez pas encore créé de demande de visite." 
            : "Aucune demande de visite pour le moment."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="border border-border/50 hover:border-border transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {request.requesterName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Demande créée le {format(request.createdAt, "PPP 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <Separator />

                {/* Visit Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {request.visitDate ? format(request.visitDate, "PPP", { locale: fr }) : "Non définie"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">
                        {request.startTime} - {request.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary-foreground" />
                    <div>
                      <p className="text-sm font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">
                        {request.numberOfPeople} personne{request.numberOfPeople > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Lieu</p>
                      <p className="text-sm text-muted-foreground">{request.location}</p>
                    </div>
                  </div>

                  {request.needsCatering && (
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium">Restauration</p>
                        <p className="text-sm text-muted-foreground">
                          Livraison: {request.deliveryTime || "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.isClient && request.clientNumber && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Client</p>
                        <p className="text-sm text-muted-foreground">#{request.clientNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {(request.allergies || request.clientReference || request.comments) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {request.allergies && (
                        <div>
                          <p className="text-sm font-medium mb-1">Allergies/Restrictions</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {request.allergies}
                          </p>
                        </div>
                      )}

                      {request.clientReference && (
                        <div>
                          <p className="text-sm font-medium mb-1">Référence client/prestataire</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {request.clientReference}
                          </p>
                        </div>
                      )}

                      {request.comments && (
                        <div>
                          <p className="text-sm font-medium mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Commentaires
                          </p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {request.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {showActions && request.status === "pending" && onStatusUpdate && (
                <div className="flex gap-2 lg:flex-col lg:w-32">
                  <Button
                    onClick={() => onStatusUpdate(request.id, "approved")}
                    size="sm"
                    className="flex-1 lg:w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => onStatusUpdate(request.id, "rejected")}
                    variant="destructive"
                    size="sm"
                    className="flex-1 lg:w-full"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
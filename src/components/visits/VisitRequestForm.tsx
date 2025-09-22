import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Send, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VisitRequest {
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
}

interface VisitRequestFormProps {
  onSubmit: (request: VisitRequest) => void;
  userName: string;
}

export const VisitRequestForm = ({ onSubmit, userName }: VisitRequestFormProps) => {
  const [formData, setFormData] = useState<VisitRequest>({
    requesterName: userName,
    numberOfPeople: 1,
    visitDate: null,
    startTime: "",
    endTime: "",
    isClient: false,
    clientNumber: "",
    needsCatering: false,
    location: "",
    deliveryTime: "",
    allergies: "",
    clientReference: "",
    comments: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.visitDate || !formData.startTime || !formData.endTime || !formData.location) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de visite a été transmise au valideur",
    });

    // Reset form
    setFormData({
      requesterName: userName,
      numberOfPeople: 1,
      visitDate: null,
      startTime: "",
      endTime: "",
      isClient: false,
      clientNumber: "",
      needsCatering: false,
      location: "",
      deliveryTime: "",
      allergies: "",
      clientReference: "",
      comments: "",
    });
  };

  const timeOptions = [
    "8h00", "8h30", "9h00", "9h30", "10h00", "10h30", "11h00", "11h30",
    "12h00", "12h30", "13h00", "13h30", "14h00", "14h30", "15h00", "15h30",
    "16h00", "16h30", "17h00", "17h30", "18h00", "18h30", "19h00", "19h30"
  ];

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Nouvelle demande de visite
        </CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour organiser votre visite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requesterName">Nom prénom du demandeur *</Label>
              <Input
                id="requesterName"
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Combien de personnes accueilles-tu ? *</Label>
              <Input
                id="numberOfPeople"
                type="number"
                min="1"
                max="50"
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) || 1 })}
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quel jour ? *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !formData.visitDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.visitDate ? format(formData.visitDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.visitDate || undefined}
                    onSelect={(date) => setFormData({ ...formData, visitDate: date || null })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Heure de début *</Label>
              <Select value={formData.startTime} onValueChange={(value) => setFormData({ ...formData, startTime: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Heure de début" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Heure de fin *</Label>
              <Select value={formData.endTime} onValueChange={(value) => setFormData({ ...formData, endTime: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Heure de fin" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Est-ce un client ?</Label>
                <Select value={formData.isClient ? "yes" : "no"} onValueChange={(value) => setFormData({ ...formData, isClient: value === "yes" })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Oui</SelectItem>
                    <SelectItem value="no">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.isClient && (
                <div className="space-y-2">
                  <Label htmlFor="clientNumber">Numéro client</Label>
                  <Input
                    id="clientNumber"
                    value={formData.clientNumber}
                    onChange={(e) => setFormData({ ...formData, clientNumber: e.target.value })}
                    className="bg-background"
                    placeholder="Numéro du client"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>As-tu besoin d'un petit-déjeuner/goûter/repas ?</Label>
                <Select value={formData.needsCatering ? "yes" : "no"} onValueChange={(value) => setFormData({ ...formData, needsCatering: value === "yes" })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Oui</SelectItem>
                    <SelectItem value="no">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Est-ce pour Lepic ou Fromentin ? *</Label>
              <Select value={formData.location} onValueChange={(value: "Lepic" | "Fromentin") => setFormData({ ...formData, location: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Choisir le lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lepic">Lepic</SelectItem>
                  <SelectItem value="Fromentin">Fromentin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.needsCatering && (
              <div className="space-y-2">
                <Label>Heure de la livraison</Label>
                <Select value={formData.deliveryTime} onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Heure de livraison" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies/restrictions</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="bg-background"
              placeholder="Mentionnez toute allergie ou restriction alimentaire"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientReference">Référence client.e ou prestataire</Label>
            <Input
              id="clientReference"
              value={formData.clientReference}
              onChange={(e) => setFormData({ ...formData, clientReference: e.target.value })}
              className="bg-background"
              placeholder="Référence du client ou du prestataire"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">As-tu une remarque/commentaire/précision à donner ?</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="bg-background"
              placeholder="Vos commentaires ou précisions"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Envoyer ma demande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
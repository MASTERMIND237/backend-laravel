import { z } from 'zod';

const optionalTrimmedString = (max, message) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    },
    z.string().max(max, message).optional(),
  );

const optionalDateString = () =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    },
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (YYYY-MM-DD)').optional(),
  );

export const validators = {
  // Validation Login
  login: z.object({
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  }),

  // Validation Véhicule (frontend -> mapped to backend fields)
  vehicule: z.object({
    marque: z.string().min(2, "La marque est requise"),
    modele: z.string().min(2, "Le modèle est requis"),
    annee_fabrication: z.number().int().min(1900).max(new Date().getFullYear()),
    immatriculation: z.string().min(2, "Immatriculation trop courte"),
    type_vehicule: z.enum(['bus', 'minibus', 'berline', 'van']),
    capacite_passagers: z.number().int().min(1, 'La capacité doit être d’au moins 1 passager'),
    carburant: z.enum(['essence', 'diesel', 'hybride', 'electrique']),
    kilometrage_actuel: z.number().int().min(0),
    couleur: optionalTrimmedString(50, 'La couleur est trop longue'),
    numero_chassis: optionalTrimmedString(100, 'Le numéro de châssis est trop long'),
    date_mise_en_service: optionalDateString(),
    date_expiration_assurance: optionalDateString(),
    date_expiration_visite_technique: optionalDateString(),
    statut: z.enum(['disponible', 'en_route', 'en_maintenance', 'hors_service']).optional(),
    notes: optionalTrimmedString(1000, 'Les notes sont trop longues'),
  }),

  // Validation Inscription
  register: z.object({
    nom: z.string().min(2, "Le nom est requis"),
    prenom: z.string().min(2, "Le prénom est requis"),
    email: z.string().email("Format d'email invalide"),
    telephone: optionalTrimmedString(20, 'Le numéro de téléphone est trop long'),
    password: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .regex(/[A-Za-z]/, 'Le mot de passe doit contenir au moins une lettre')
      .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre'),
    password_confirmation: z.string().min(8),
    role: z.enum(['gestionnaire', 'chauffeur']).optional(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: "La confirmation du mot de passe ne correspond pas",
    path: ['password_confirmation'],
  }),

  // Validation Chauffeur
  driver: z.object({
    user_id: z.number().int().positive("Identifiant utilisateur requis"),
    numero_permis: z.string().min(5, "Numéro de permis requis"),
    categorie_permis: z.enum(['B','C','D','E']),
    date_delivrance_permis: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Date invalide (YYYY-MM-DD)"),
    date_expiration_permis: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Date invalide (YYYY-MM-DD)"),
    numero_cni: optionalTrimmedString(50, 'Le numéro de CNI est trop long'),
    date_naissance: optionalDateString(),
    adresse: optionalTrimmedString(255, "L'adresse est trop longue"),
    ville: optionalTrimmedString(100, 'La ville est trop longue'),
    annees_experience: z.number().int().min(0).max(50).optional(),
    statut: z.enum(['actif','inactif','suspendu']).optional(),
    notes: optionalTrimmedString(1000, 'Les notes sont trop longues'),
  })
};

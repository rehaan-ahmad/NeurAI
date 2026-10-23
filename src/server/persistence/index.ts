// Repository factory — NeurAI
//
// Returns Supabase-backed repositories when Supabase is provisioned and
// configured, otherwise the visibly-labeled synthetic demo adaptor. The demo
// adaptor is the default and can never be mistaken for production.

import {
  SupabaseAssessmentRepository,
  SupabasePatientRepository,
  SupabaseUserRepository,
} from "@/server/persistence/repositories";
import { isSupabaseConfigured } from "@/server/persistence/supabase";
import {
  DemoAssessmentRepository,
  DemoPatientRepository,
  DemoAuthRepository,
} from "@/lib/demo/adaptor";
import type {
  AssessmentRepository,
  AuthRepository,
  PatientRepository,
} from "@/lib/repositories";

export function getPatientRepository(): PatientRepository {
  return isSupabaseConfigured()
    ? new SupabasePatientRepository()
    : new DemoPatientRepository();
}

export function getAssessmentRepository(): AssessmentRepository {
  return isSupabaseConfigured()
    ? new SupabaseAssessmentRepository()
    : new DemoAssessmentRepository();
}

export function getAuthRepository(): AuthRepository {
  return isSupabaseConfigured()
    ? new SupabaseUserRepository()
    : new DemoAuthRepository();
}

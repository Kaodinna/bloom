// ─────────────────────────────────────────────────────────────
// Bubble Workflow API
// All backend workflows use POST (not GET).
// Parameters are sent as JSON body.
// ─────────────────────────────────────────────────────────────
import { bubbleGet, bubblePost } from "./bubble";
import { getToken } from "./auth";
import { Job } from "@/data/job_index";
import { OnboardingData } from "@/store/onboarding";

function tok(): string {
  const t = getToken();
  if (!t) throw new Error("Not authenticated");
  return t;
}

// export async function triggerOnboardingComplete(
//   userId: string,
//   profileData: OnboardingData,
//   femaleJob: Job | null,
//   maleJob: Job | null,
// ) {
//   return bubblePost('/wf/onboarding_complete', {
//     calling_user:             userId,
//     first_name:               profileData.first_name,
//     age:                      Number(profileData.age) || 0,
//     journey_type:             profileData.journey_type,
//     target_conception_season: profileData.target_conception_season,
//     previous_children:        Number(profileData.previous_children) || 0,
//     nationality:              profileData.nationality,
//     country:                  profileData.country,
//     city:                     profileData.city,
//     job_type:                 profileData.job_type,
//     activity_level:           profileData.activity_level,
//     diet_type:                profileData.diet_type,
//     sun_exposure:             profileData.sun_exposure,
//     partner_age:              Number(profileData.partner_age) || 0,
//     partner_job_type:         profileData.partner_job_type,
//     partner_activity:         profileData.partner_activity,
//     partner_diet:             profileData.partner_diet,
//     female_job_risks:   femaleJob?.common_risks.join(', ')       ?? '',
//     female_nutrients:   femaleJob?.nutrient_risks.join(', ')     ?? '',
//     female_foods:       femaleJob?.recommended_foods?.join(', ') ?? '',
//     male_job_risks:     maleJob?.common_risks.join(', ')         ?? '',
//     male_nutrients:     maleJob?.nutrient_risks.join(', ')       ?? '',
//     male_foods:         maleJob?.recommended_foods?.join(', ')   ?? '',
//     male_sperm_impact:  (maleJob as any)?.fertility_impact?.sperm    ?? '',
//     male_hormone_impact:(maleJob as any)?.fertility_impact?.hormones ?? '',
//     baby_impact:        (maleJob as any)?.fertility_impact?.baby_impact ?? '',
//   }, tok())
// }
export async function triggerOnboardingComplete(userId: string) {
  return bubbleGet(
    "/wf/onboarding_complete",
    {
      calling_user: userId,
    },
    tok(),
  );
}
export async function triggerGenerateProtocol(userId: string) {
  return bubblePost("/wf/process_protocol", { calling_user: userId }, tok());
}

export async function triggerGenerateScore(userId: string) {
  return bubblePost("/wf/process_score", { calling_user: userId }, tok());
}

export async function triggerGenerateNutrition(userId: string) {
  return bubbleGet("/wf/generate_nutrition", { calling_user: userId }, tok());
}

export async function triggerRecalibrate(userId: string) {
  return bubblePost("/wf/recalibrate", { calling_user: userId }, tok());
}

export async function triggerLikePost(postId: string) {
  return bubblePost("/wf/like_post", { post_id: postId }, tok());
}

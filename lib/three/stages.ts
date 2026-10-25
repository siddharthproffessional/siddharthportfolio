/** Stage names shared by the 3D scenes and their UI. Kept separate so UI code doesn't pull in three.js. */
export type HeroStage = 'Wireframe' | 'Clay' | 'Material'
export const STORY_STAGES = ['Capture', 'Model', 'Prepare', 'Simulate', 'Deliver'] as const

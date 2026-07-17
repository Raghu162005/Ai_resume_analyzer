interface SkillTagProps {
  skill: string;
  type: "matched" | "missing";
}

export default function SkillTag({ skill, type }: SkillTagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        type === "matched"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {type === "matched" ? "✓" : "✗"} {skill}
    </span>
  );
}

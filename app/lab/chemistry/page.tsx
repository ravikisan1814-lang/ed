"use client";

import ChemistryLab from "@/components/lab/chemistry-lab";
import ChemistryLabShell from "@/components/page-shells/ChemistryLabShell";

export default function ChemistryPage() {
  return (
    <ChemistryLabShell>
      <ChemistryLab />
    </ChemistryLabShell>
  );
}

"use client";

import BiologyLab from "@/components/lab/biology-lab";
import BiologyLabShell from "@/components/page-shells/BiologyLabShell";

export default function BiologyPage() {
  return (
    <BiologyLabShell>
      <BiologyLab />
    </BiologyLabShell>
  );
}

import React from "react";

export interface NavItemType {
    href: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

'use client';

import { useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import type { Heading } from '@/lib/editor/functions';
import { ChevronDownIcon } from './icons';

interface DocumentOutlineProps {
  outline: Heading[];
  onSelect: (heading: Heading) => void;
}

export function DocumentOutline({ outline, onSelect }: DocumentOutlineProps) {
  const [open, setOpen] = useState(true);

  if (outline.length === 0) return null;

  return (
    <SidebarGroup className="border-t" data-testid="document-outline">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel className="cursor-pointer select-none" onClick={() => setOpen(!open)}>
          Outline
        </SidebarGroupLabel>
        <button onClick={() => setOpen(!open)} className="p-1" aria-label="Toggle outline">
          <ChevronDownIcon size={12} style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
        </button>
      </div>
      {open && (
        <SidebarGroupContent>
          <SidebarMenu>
            {outline.map((item, idx) => (
              <SidebarMenuItem key={idx} style={{ paddingLeft: (item.level - 1) * 8 }}>
                <SidebarMenuButton asChild>
                  <button className="truncate w-full text-left" onClick={() => onSelect(item)}>
                    {item.text || 'Untitled'}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}

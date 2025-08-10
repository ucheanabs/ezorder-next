#!/usr/bin/env bash
set -euo pipefail

# --- 1) Remove any leftover heredoc junk accidentally pasted into code files ---
LC_ALL=C find app -type f -name "*.ts" -o -name "*.tsx" -o -name "*.css" | while read -r f; do
  # Remove lines that literally start with: cat > ...  and standalone EOF lines
  sed -i '' -e '/^cat >/d' -e '/^EOF$/d' "$f" || true
done

# --- 2) Fix "@/lib/db" imports to RELATIVE paths (quote brackets so shell won’t glob) ---
fix_import() {
  local file="$1" to="$2"
  [ -f "$file" ] && sed -i '' "s#@/lib/db#${to}#g" "$file" || true
}

fix_import "app/api/events/route.ts" "../../../lib/db"
fix_import "app/api/events/[eventId]/route.ts" "../../../../lib/db"
fix_import "app/api/events/[eventId]/menu/route.ts" "../../../../../lib/db"
fix_import "app/api/events/[eventId]/orders/route.ts" "../../../../../lib/db"
fix_import "app/api/orders/route.ts" "../../../lib/db"
fix_import "app/api/orders/[orderId]/route.ts" "../../../../lib/db"
fix_import "app/api/orders/[orderId]/status/route.ts" "../../../../../lib/db"

# --- 3) Ensure client components start with 'use client' on line 1 ---
ensure_client() {
  local f="$1"
  [ -f "$f" ] || return 0
  # If first line isn't 'use client'; insert it
  head -n 1 "$f" | grep -q "^'use client';" || (printf "'use client';\n" | cat - "$f" > "$f.tmp" && mv "$f.tmp" "$f")
}
ensure_client "app/admin/page.tsx"
ensure_client "app/admin/create/page.tsx"
ensure_client "app/admin/events/[id]/page.tsx"
ensure_client "app/order/OrderClient.tsx"
ensure_client "app/qr/QRClient.tsx"

# --- 4) Fix dynamic() name collision on /order and remove dynamic export on /qr ---
if [ -f "app/order/page.tsx" ]; then
  sed -i '' "s#import dynamic from 'next/dynamic'#import NextDynamic from 'next/dynamic'#" "app/order/page.tsx" || true
  sed -i '' 's#\bdynamic(()#NextDynamic(()#' "app/order/page.tsx" || true
  # Keep only the first 'export const dynamic =' line if multiple exist
  awk 'BEGIN{seen=0} { if($0 ~ /^export const dynamic *=/){ if(seen){next} seen=1 } print }' "app/order/page.tsx" > "app/order/page.tsx.tmp" && mv "app/order/page.tsx.tmp" "app/order/page.tsx"
fi

[ -f "app/qr/page.tsx" ] && sed -i '' '/^export const dynamic *=/d' "app/qr/page.tsx" || true

# --- 5) Install dep, build, deploy ---
npm i qrcode --save
npm run build
vercel --prod

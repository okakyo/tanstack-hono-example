import { createListCollection } from "@chakra-ui/react";
import { useAuth } from "@/shareds/provider";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/shareds/ui/base-select";
import { useSwitchTenant } from "@/widgets/layouts/header/api/switch-tenant";

export const TenantSelector = () => {
  const { selectableTenants, currentTenantId } = useAuth();
  const switchTenantMutation = useSwitchTenant();

  const tenantCollection = createListCollection({
    items: selectableTenants.map((tenant) => ({
      label: tenant.companyName,
      value: tenant.tenantId,
    })),
  });

  const handleTenantChange = (selectedTenantId: string) => {
    if (!selectedTenantId || selectedTenantId === currentTenantId) {
      return;
    }

    switchTenantMutation.mutate({ data: { tenantId: selectedTenantId } });
  };

  if (!selectableTenants || selectableTenants.length === 0) {
    return null; // selectableTenantsが空の場合は何も表示しない
  }

  return (
    <SelectRoot
      onValueChange={(value) => handleTenantChange(value.value[0])}
      collection={tenantCollection}
      value={[currentTenantId ?? tenantCollection.items[0].value]}
      backgroundColor="white"
      size="sm"
      disabled={switchTenantMutation.isPending}
    >
      <SelectTrigger>
        <SelectValueText width="200px" placeholder="テナントを選択" />
      </SelectTrigger>
      <SelectContent>
        {tenantCollection.items.map((tenant) => (
          <SelectItem key={tenant.value} item={tenant} padding="8px">
            {tenant.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

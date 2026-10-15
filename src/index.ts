/**
 * adwaita-gpuix — a libadwaita-styled component library for GPUix.
 *
 * Public entry. `import { AdwaitaProvider, Button, ... } from 'adwaita-gpuix'`
 * re-exports the theme system and every component in `./components`.
 */

// ── Theme ────────────────────────────────────────────────────────────────
export {
  AdwaitaProvider,
  useAdwaita,
  AdwaitaContext,
  buildTheme,
  ACCENTS,
  RADIUS,
  SPACE,
  TYPE,
  resolveTokens,
  tokensToDtcg,
  tokensToDtcgAll,
  hexToRgba,
  shade,
  accentForeground,
} from './theme/adwaita'
export type {
  ColorScheme,
  AccentKey,
  AdwaitaTheme,
  AdwaitaColors,
  AdwaitaProviderProps,
  SemanticTokens,
} from './theme/adwaita'

// ── Text / icons ─────────────────────────────────────────────────────────
export { T, SectionTitle, MenuIndicator, MenuShortcut } from './components/common'
export type { TextProps, TextSize } from './components/common'
export { Icon, ICONS } from './components/icons'
export type { IconName, IconProps } from './components/icons'

// ── Components ───────────────────────────────────────────────────────────
export { Button } from './components/Button'
export type { ButtonVariant, ButtonSize, ButtonProps } from './components/Button'
export { HeaderBar } from './components/HeaderBar'
export type { HeaderBarProps } from './components/HeaderBar'
export { Banner, BannerTitle, BannerDescription } from './components/Banner'
export type { BannerProps, BannerTone, BannerVariant, BannerTitleProps, BannerDescriptionProps } from './components/Banner'
export { Toast, } from './components/Toast'
export type { ToastProps, ToastType } from './components/Toast'
export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'
export { StatusPage } from './components/StatusPage'
export type { StatusPageProps } from './components/StatusPage'
export { Switch } from './components/Switch'
export type { SwitchProps } from './components/Switch'
export { Entry } from './components/Entry'
export type { EntryProps, EntryType } from './components/Entry'
export { Card, Frame } from './components/Card'
export type { CardProps, FrameProps } from './components/Card'
export {
  BoxedList,
  ActionRow,
  EntryRow,
  SwitchRow,
  SpinRow,
  ComboRow,
  ExpanderRow,
  ButtonRow,
} from './components/BoxedList'
export type {
  ActionRowProps,
  EntryRowProps,
  SwitchRowProps,
  SpinRowProps,
  ComboRowProps,
  ExpanderRowProps,
  ButtonRowProps,
} from './components/BoxedList'
export {
  AlertDialog,
  MessageDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from './components/AlertDialog'
export type {
  AlertDialogProps,
  AlertDialogAction,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from './components/AlertDialog'
export { Tabs, TabBar, TabsList, TabsTrigger, TabsContent, useTabs } from './components/Tabs'
export type { TabsProps, TabItem, TabsCtxValue, TabsListProps, TabsTriggerProps, TabsContentProps } from './components/Tabs'
export { ToggleGroup } from './components/ToggleGroup'
export type { ToggleGroupProps, ToggleOption } from './components/ToggleGroup'
export { Avatar, AvatarBadge, AvatarGroup, AvatarGroupCount } from './components/Avatar'
export type { AvatarProps, AvatarBadgeProps, AvatarGroupProps, AvatarGroupCountProps } from './components/Avatar'
export { ProgressBar } from './components/ProgressBar'
export type { ProgressBarProps } from './components/ProgressBar'
export { ViewSwitcher } from './components/ViewSwitcher'
export type { ViewSwitcherProps, ViewSwitcherItem } from './components/ViewSwitcher'
export { PreferencesPage, PreferencesGroup } from './components/PreferencesPage'
export type { PreferencesPageProps, PreferencesGroupProps } from './components/PreferencesPage'

// ── shadcn primitives (delegation 1) ─────────────────────────────────
export { Badge } from './components/Badge'
export type { BadgeVariant, BadgeProps } from './components/Badge'
export { Label } from './components/Label'
export type { LabelProps } from './components/Label'
export { Separator } from './components/Separator'
export type { SeparatorProps } from './components/Separator'
export { Skeleton } from './components/Skeleton'
export type { SkeletonProps } from './components/Skeleton'
export { Kbd, KbdGroup } from './components/Kbd'
export type { KbdProps, KbdGroupProps } from './components/Kbd'
export { Alert, AlertTitle, AlertDescription } from './components/Alert'
export type { AlertVariant, AlertProps, AlertTitleProps, AlertDescriptionProps } from './components/Alert'
export { AspectRatio } from './components/AspectRatio'
export type { AspectRatioProps } from './components/AspectRatio'
export { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, EmptyAction, EmptyHeader } from './components/Empty'
export type {
  EmptyProps,
  EmptyMediaProps,
  EmptyTitleProps,
  EmptyDescriptionProps,
  EmptyContentProps,
  EmptyActionProps,
  EmptyHeaderProps,
} from './components/Empty'
export { Heading, Paragraph, Small, Blockquote, InlineCode } from './components/Typography'
export type {
  HeadingProps,
  ParagraphProps,
  SmallProps,
  BlockquoteProps,
  InlineCodeProps,
} from './components/Typography'
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './components/Card'
export type {
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardActionProps,
} from './components/Card'
export { Input } from './components/Input'
export type { InputProps, InputType } from './components/Input'
export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from './components/InputGroup'
export type {
  InputGroupProps,
  InputGroupInputProps,
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupTextProps,
  InputGroupTextareaProps,
} from './components/InputGroup'
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './components/InputOTP'
export type {
  InputOTPProps,
  InputOTPGroupProps,
  InputOTPSlotProps,
  InputOTPSeparatorProps,
} from './components/InputOTP'
export { Textarea } from './components/Textarea'
export type { TextareaProps } from './components/Textarea'
export { Checkbox } from './components/Checkbox'
export type { CheckboxProps, CheckboxState } from './components/Checkbox'
export { RadioGroup, RadioGroupItem } from './components/RadioGroup'
export type { RadioGroupProps, RadioGroupItemProps } from './components/RadioGroup'
export { Slider } from './components/Slider'
export type { SliderProps } from './components/Slider'
export { Toggle } from './components/Toggle'
export type { ToggleVariant, ToggleSize, ToggleProps } from './components/Toggle'
export { NativeSelect } from './components/NativeSelect'
export type { NativeSelectProps, NativeSelectOption, NativeSelectGroup } from './components/NativeSelect'
export { Field, FieldLabel, FieldDescription, FieldError, FieldContent, FieldSet, FieldLegend, FieldGroup, FieldTitle, FieldSeparator } from './components/Field'
export type {
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldContentProps,
  FieldSetProps,
  FieldLegendProps,
  FieldGroupProps,
  FieldTitleProps,
  FieldSeparatorProps,
} from './components/Field'
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './components/Select'
export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
} from './components/Select'
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion'
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './components/Accordion'
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/Collapsible'
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from './components/Collapsible'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableFootCell,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './components/Table'
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableFootCellProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from './components/Table'
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './components/Breadcrumb'
export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from './components/Breadcrumb'
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  pageSequence,
} from './components/Pagination'
export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from './components/Pagination'
export { Carousel, CarouselItem, CarouselPrevious, CarouselNext } from './components/Carousel'
export type { CarouselProps, CarouselItemProps } from './components/Carousel'
export { Resizable, ResizablePanel, ResizableHandle, ResizablePanelGroup } from './components/Resizable'
export type {
  ResizableProps,
  ResizablePanelProps,
  ResizableHandleProps,
  ResizablePanelGroupProps,
} from './components/Resizable'

// ── shadcn overlays & heavy components (delegation 2) ─────────────
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogShowcase } from './components/Dialog'
export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogCloseProps,
} from './components/Dialog'
export {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerShowcase,
  DrawerTrigger,
  DrawerDescription,
  DrawerFooter,
} from './components/Drawer'
export type {
  DrawerProps,
  DrawerSide,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerCloseProps,
  DrawerTriggerProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
} from './components/Drawer'
export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetShowcase,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from './components/Sheet'
export type {
  SheetProps,
  SheetSide,
  SheetContentProps,
  SheetHeaderProps,
  SheetTitleProps,
  SheetCloseProps,
  SheetTriggerProps,
  SheetDescriptionProps,
  SheetFooterProps,
} from './components/Sheet'
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from './components/Popover'
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverAnchorProps,
  PopoverHeaderProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
} from './components/Popover'
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components/Tooltip'
export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from './components/Tooltip'
export { HoverCard, HoverCardTrigger, HoverCardContent } from './components/HoverCard'
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
} from './components/HoverCard'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
} from './components/DropdownMenu'
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuGroupProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuShortcutProps,
} from './components/DropdownMenu'
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './components/ContextMenu'
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
} from './components/ContextMenu'
export {
  Menubar,
  MenubarItem,
  MenubarTrigger,
  MenubarContent,
  MenubarLabel,
  MenubarSeparator,
  MenubarMenu,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarRadioGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
} from './components/Menubar'
export type {
  MenubarProps,
  MenubarItemProps,
  MenubarTriggerProps,
  MenubarContentProps,
  MenubarLabelProps,
  MenubarSeparatorProps,
  MenubarMenuProps,
  MenubarCheckboxItemProps,
  MenubarRadioItemProps,
  MenubarRadioGroupProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
  MenubarShortcutProps,
} from './components/Menubar'
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './components/NavigationMenu'
export type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
} from './components/NavigationMenu'
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
} from './components/Command'
export type {
  CommandProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandShortcutProps,
  CommandSeparatorProps,
  CommandDialogProps,
} from './components/Command'
export { Calendar, DatePicker } from './components/Calendar'
export type {
  CalendarMode,
  CalendarProps,
  DatePickerProps,
} from './components/Calendar'
export { Chart, ChartLegend } from './components/Chart'
export type {
  ChartDataPoint,
  ChartSeriesValue,
  ChartSeriesPoint,
  ChartData,
  ChartProps,
  ChartLegendItem,
  ChartLegendProps,
} from './components/Chart'

// ── Additional components (delegation 3) ─────────────────────────────
export {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxLabel,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxChips,
} from './components/Combobox'
export type {
  ComboboxProps,
  ComboboxInputProps,
  ComboboxTriggerProps,
  ComboboxValueProps,
  ComboboxContentProps,
  ComboboxListProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
  ComboboxLabelProps,
  ComboboxGroupProps,
  ComboboxSeparatorProps,
  ComboboxChipsProps,
  ComboboxItemObject,
  ComboboxItemEntry,
} from './components/Combobox'
export { NumberField } from './components/NumberField'
export type { NumberFieldProps } from './components/NumberField'
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenuItem,
} from './components/Sidebar'
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupContentProps,
  SidebarFooterProps,
  SidebarMenuItemProps,
} from './components/Sidebar'
export { ListBox, ListBoxItem } from './components/ListBox'
export type { ListBoxProps, ListBoxItemProps } from './components/ListBox'
export { Description } from './components/Description'
export type { DescriptionProps } from './components/Description'
export { Toaster, useToasts } from './components/Toaster'
export type { ToasterProps, ToasterPosition, ToastItem, ToastOptions } from './components/Toaster'

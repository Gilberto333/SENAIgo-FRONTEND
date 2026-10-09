import { Bot, Snowflake, MapPin } from 'lucide-react';

const ICONS = { bot: Bot, snowflake: Snowflake };

export const getSalaIcon = (key) => ICONS[key] || MapPin;

import { ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Collapse,
  Flex,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { BiSolidGame } from "react-icons/bi";
import { FaCrown, FaHome, FaTrophy } from "react-icons/fa";

import { useOptionalUser } from "~/hooks/loader";
import type { TFunctionArg } from "~/i18next";

import Auth from "./auth";
import DoveCompatibleIcon from "./doveCompatibleIcon";
import LocaleToggle from "./localeToggle";
import ThemeEditor from "./themeEditor";
import UserDropdown, { DropdownRightIcon } from "./userDropdown";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const user = useOptionalUser();

  return (
    <Box
      pos="fixed"
      zIndex={161}
      top={0}
      w="100%"
      color={useColorModeValue("gray.600", "white")}
      bg={useColorModeValue("whiteAlpha.800", "rgba(26, 32, 44, .8)")}
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      backdropFilter="blur(14px)"
    >
      <Flex align="center" maxW="6xl" mx="auto" px={4} py={2}>
        <Flex display={{ base: "flex", md: "none" }} ml={-2}>
          <IconButton
            aria-label="Toggle Navigation"
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            isRound
            onClick={onToggle}
            variant="ghost"
          />
        </Flex>
        <Flex align="center" justify="start" flex={1}>
          <Text
            display={{ base: "none", sm: "block" }}
            pl={{ base: 3, md: 0 }}
            color={useColorModeValue("gray.800", "white")}
            fontFamily="heading"
            fontSize="xl"
            fontWeight={600}
            textAlign="center"
          >
            polygen
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <ButtonGroup spacing="13px">
          <LocaleToggle />
          <ThemeEditor />
          {user ? <UserDropdown /> : <Auth />}
        </ButtonGroup>
      </Flex>

      <Collapse animateOpacity in={isOpen}>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

function DesktopNav() {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const linkTransition = "color .1s ease";
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  const { t } = useTranslation();

  return (
    <HStack spacing={4}>
      {NAV_ITEMS.map(({ label, to, children, icon }) => (
        <Popover key={label} placement="bottom-start" trigger="hover">
          <PopoverTrigger>
            <Box>
              <Flex
                as={to ? Link : undefined}
                align="center"
                p={2}
                color={linkColor}
                fontSize=".9rem"
                fontWeight={500}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor
                }}
                cursor="pointer"
                transition={linkTransition}
                to={to}
              >
                <DoveCompatibleIcon as={icon} mr="5px" />
                {t(label)}
              </Flex>
            </Box>
          </PopoverTrigger>

          {children ? (
            <PopoverContent
              minW="xs"
              p={4}
              bg={popoverContentBgColor}
              border={0}
              shadow="xl"
              rounded="xl"
            >
              <VStack>
                {children.map(child => (
                  <DesktopSubNav key={child.label} {...child} />
                ))}
              </VStack>
            </PopoverContent>
          ) : null}
        </Popover>
      ))}
    </HStack>
  );
}

function DesktopSubNav({ label, to, icon, description }: NavItem) {
  const linkHoverBg = useColorModeValue("gray.50", "gray.900");
  const groupColor = useColorModeValue("gray.600", "gray.200");
  const groupHoverColor = useColorModeValue("gray.800", "white");
  const transition = "all .2s ease";

  const { t } = useTranslation();

  return (
    <Box
      as={Link}
      display="block"
      w="100%"
      p={2}
      _hover={{ bg: linkHoverBg }}
      transition={transition}
      role="group"
      rounded="md"
      to={to}
    >
      <HStack align="center">
        <Box>
          <Text
            alignItems="center"
            display="flex"
            color={groupColor}
            fontWeight={500}
            _groupHover={{ color: groupHoverColor }}
            transition={transition}
          >
            <DoveCompatibleIcon as={icon} mr="5px" />
            {t(label)}
          </Text>
          <Text color={groupColor} fontSize="sm">
            {t(description!)}
          </Text>
        </Box>
        <Flex
          align="center"
          justify="flex-end"
          flex={1}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          transform="translateX(-10px)"
          transition={transition}
        >
          <Icon as={ChevronRightIcon} w={5} h={5} color={groupHoverColor} />
        </Flex>
      </HStack>
    </Box>
  );
}

function MobileNav() {
  return (
    <VStack
      alignItems="flex-start"
      gap={3}
      display={{ base: "flex", md: "none" }}
      p={4}
    >
      {NAV_ITEMS.map(navItem => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </VStack>
  );
}

function MobileNavItem({ label, to, icon, children }: NavItem) {
  const { isOpen, onToggle } = useDisclosure();

  const { t } = useTranslation();

  return (
    <VStack
      alignItems="flex-start"
      w="100%"
      onClick={children ? onToggle : undefined}
      spacing={2}
    >
      <Flex
        as={children ? undefined : Link}
        align="center"
        justify="space-between"
        w="100%"
        color={useColorModeValue("gray.600", "gray.200")}
        fontWeight={500}
        _hover={{ textDecoration: "none" }}
        to={to}
      >
        <Flex align="center">
          <DoveCompatibleIcon as={icon} mr="5px" />
          {t(label)}
        </Flex>
        {children ? <DropdownRightIcon isOpen={isOpen} /> : null}
      </Flex>

      <Collapse animateOpacity in={isOpen} style={{ marginTop: "0!important" }}>
        <VStack pl={4} borderLeftWidth="2px">
          {children
            ? children.map(child => (
                <Flex
                  key={child.label}
                  as={Link}
                  align="center"
                  py={2}
                  to={child.to}
                >
                  <DoveCompatibleIcon as={child.icon} mr="5px" />
                  {t(child.label)}
                </Flex>
              ))
            : null}
        </VStack>
      </Collapse>
    </VStack>
  );
}

interface NavItem {
  label: TFunctionArg;
  icon: IconType | "dove";
  to?: string;
  children?: NavItem[];
  description?: TFunctionArg;
}

const NAV_ITEMS: NavItem[] = [
  { label: "nav.home", icon: FaHome, to: "/" },
  { label: "nav.game", icon: FaCrown, to: "/game" },
  { label: "nav.leaderboard", icon: FaTrophy, to: "/leaderboard" },
  {
    label: "nav.apps",
    icon: "dove",
    children: [
      {
        label: "nav.casual-games",
        icon: BiSolidGame,
        to: "/catch-the-cat",
        description: "nav.description-casual-games"
      }
    ]
  }
];
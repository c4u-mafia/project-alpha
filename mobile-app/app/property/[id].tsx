import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Share,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useListingDetail,
  useSavedListings,
  useSaveListing,
  useUnsaveListing,
  useCurrentUser,
  useViewingSlots,
  useRequestViewing,
  ViewingSlot,
} from '@/hooks/use-api';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 340;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

const formatSlotDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const formatSlotTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
};

const AMENITY_ICONS: { match: RegExp; icon: keyof typeof Ionicons.glyphMap }[] = [
  { match: /wifi|internet|fib(er|re)/i, icon: 'wifi-outline' },
  { match: /security|gate|cctv|guard/i, icon: 'shield-checkmark-outline' },
  { match: /parking|car/i, icon: 'car-outline' },
  { match: /power|generator|solar|electric/i, icon: 'flash-outline' },
  { match: /water|borehole/i, icon: 'water-outline' },
  { match: /pool|swim/i, icon: 'fitness-outline' },
  { match: /gym|fitness/i, icon: 'barbell-outline' },
  { match: /air.?con|ac\b|cooling/i, icon: 'snow-outline' },
  { match: /furnish/i, icon: 'bed-outline' },
  { match: /kitchen/i, icon: 'restaurant-outline' },
  { match: /balcon|terrace/i, icon: 'sunny-outline' },
  { match: /pet/i, icon: 'paw-outline' },
];

const amenityIcon = (name: string): keyof typeof Ionicons.glyphMap =>
  AMENITY_ICONS.find((a) => a.match.test(name))?.icon ?? 'checkmark-circle-outline';

// ─── Small pieces ────────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontFamily: 'Geist_700Bold',
      color: '#1A2332',
      fontSize: 18,
      letterSpacing: -0.2,
      marginBottom: 12,
    }}>
    {children}
  </Text>
);

const StatChip = ({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#F0EBE4',
    }}>
    <Ionicons name={icon} size={15} color="#0E7C7B" />
    <Text style={{ fontFamily: 'Geist_500Medium', color: '#1A2332', fontSize: 13 }}>{label}</Text>
  </View>
);

const CostRow = ({ label, kobo, bold }: { label: string; kobo: number; bold?: boolean }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    }}>
    <Text
      style={{
        fontFamily: bold ? 'Geist_700Bold' : 'Geist_400Regular',
        color: bold ? '#1A2332' : '#6B7280',
        fontSize: 14,
      }}>
      {label}
    </Text>
    <Text
      style={{
        fontFamily: bold ? 'Geist_700Bold' : 'Geist_600SemiBold',
        color: bold ? '#0E7C7B' : '#1A2332',
        fontSize: bold ? 16 : 14,
      }}>
      {formatNaira(kobo)}
    </Text>
  </View>
);

// ─── Viewing request sheet ───────────────────────────────────────────────────

function RequestViewingSheet({
  propertyId,
  visible,
  onClose,
}: {
  propertyId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { data: slots, isLoading, isError, refetch } = useViewingSlots(propertyId, visible);
  const requestViewing = useRequestViewing();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const slotsByDate = useMemo(() => {
    const groups: { date: string; slots: ViewingSlot[] }[] = [];
    for (const slot of slots ?? []) {
      const group = groups.find((g) => g.date === slot.date);
      if (group) group.slots.push(slot);
      else groups.push({ date: slot.date, slots: [slot] });
    }
    return groups;
  }, [slots]);

  const close = () => {
    onClose();
    // Reset after the modal animation finishes
    setTimeout(() => {
      setSelectedSlotId(null);
      setMessage('');
      setSubmitted(false);
      requestViewing.reset();
    }, 300);
  };

  const submit = () => {
    if (!selectedSlotId) return;
    requestViewing.mutate(
      { propertyId, slotId: selectedSlotId, tenantMessage: message.trim() || undefined },
      { onSuccess: () => setSubmitted(true) }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={{ flex: 1, backgroundColor: 'rgba(26,35,50,0.45)', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={close} />
        <View
          style={{
            backgroundColor: '#FAF7F2',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 36,
            maxHeight: '82%',
          }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              backgroundColor: '#E5E0D8',
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />

          {submitted ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  backgroundColor: '#F0FAF9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                <Ionicons name="checkmark" size={36} color="#0E7C7B" />
              </View>
              <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 20 }}>
                Viewing requested
              </Text>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#9CA3AF',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 20,
                  paddingHorizontal: 24,
                }}>
                {"The landlord will confirm your slot. We'll notify you as soon as they respond."}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  close();
                  router.push('/viewings' as never);
                }}
                style={{
                  marginTop: 24,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: '#0E7C7B',
                }}>
                <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
                  See my viewings
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: 'Geist_700Bold',
                  color: '#1A2332',
                  fontSize: 20,
                  letterSpacing: -0.3,
                }}>
                Request a viewing
              </Text>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#9CA3AF',
                  fontSize: 13,
                  marginTop: 4,
                  marginBottom: 16,
                }}>
                Pick a time that works for you
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ paddingBottom: 8 }}>
                {isLoading && (
                  <View style={{ gap: 10 }}>
                    <Skeleton style={{ height: 44, borderRadius: 12 }} />
                    <Skeleton style={{ height: 44, borderRadius: 12 }} />
                    <Skeleton style={{ height: 44, borderRadius: 12 }} />
                  </View>
                )}

                {isError && (
                  <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <Ionicons name="cloud-offline-outline" size={32} color="#C0BBC4" />
                    <Text
                      style={{
                        fontFamily: 'Geist_600SemiBold',
                        color: '#1A2332',
                        fontSize: 15,
                        marginTop: 10,
                      }}>
                      {"Couldn't load available slots"}
                    </Text>
                    <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
                      <Text
                        style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                        Retry
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!isLoading && !isError && slotsByDate.length === 0 && (
                  <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: '#F0FAF9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}>
                      <Ionicons name="calendar-outline" size={26} color="#0E7C7B" />
                    </View>
                    <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 15 }}>
                      No slots available yet
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: '#9CA3AF',
                        fontSize: 13,
                        textAlign: 'center',
                        marginTop: 6,
                        paddingHorizontal: 24,
                        lineHeight: 19,
                      }}>
                      The landlord hasn&apos;t opened viewing times for this home. Save it and
                      check back soon.
                    </Text>
                  </View>
                )}

                {slotsByDate.map((group) => (
                  <View key={group.date} style={{ marginBottom: 14 }}>
                    <Text
                      style={{
                        fontFamily: 'Geist_600SemiBold',
                        color: '#6B7280',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        marginBottom: 8,
                      }}>
                      {formatSlotDate(group.date)}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {group.slots.map((slot) => {
                        const selected = slot.id === selectedSlotId;
                        return (
                          <TouchableOpacity
                            key={slot.id}
                            onPress={() => setSelectedSlotId(slot.id)}
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 10,
                              borderRadius: 12,
                              backgroundColor: selected ? '#0E7C7B' : 'white',
                              borderWidth: 1,
                              borderColor: selected ? '#0E7C7B' : '#F0EBE4',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Geist_600SemiBold',
                                color: selected ? 'white' : '#1A2332',
                                fontSize: 13,
                              }}>
                              {formatSlotTime(slot.startTime)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}

                {slotsByDate.length > 0 && (
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Message to the landlord (optional)"
                    placeholderTextColor="#C0BBC4"
                    multiline
                    style={{
                      fontFamily: 'Geist_400Regular',
                      fontSize: 14,
                      color: '#1A2332',
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#F0EBE4',
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      minHeight: 72,
                      textAlignVertical: 'top',
                      marginTop: 4,
                    }}
                  />
                )}
              </ScrollView>

              {requestViewing.isError && (
                <Text
                  style={{
                    fontFamily: 'Geist_500Medium',
                    color: '#DC2626',
                    fontSize: 13,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {requestViewing.error?.message?.includes('fully booked')
                    ? 'That slot just got fully booked — please pick another.'
                    : "Couldn't send your request. Please try again."}
                </Text>
              )}

              {slotsByDate.length > 0 && (
                <TouchableOpacity
                  onPress={submit}
                  disabled={!selectedSlotId || requestViewing.isPending}
                  activeOpacity={0.9}
                  style={{
                    marginTop: 14,
                    height: 54,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedSlotId ? '#0E7C7B' : '#C8D8D7',
                    opacity: requestViewing.isPending ? 0.7 : 1,
                  }}>
                  <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 15 }}>
                    {requestViewing.isPending ? 'Sending request…' : 'Confirm viewing request'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: listing, isLoading, isError, refetch } = useListingDetail(id ?? '');
  const { data: user } = useCurrentUser();
  const { data: saved } = useSavedListings();
  const saveListing = useSaveListing();
  const unsaveListing = useUnsaveListing();

  const [photoIndex, setPhotoIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_HEIGHT - 120, HERO_HEIGHT - 40], [0, 1]),
  }));

  const isTenant = user?.role !== 'landlord';
  const isSaved = (saved ?? []).some((l) => l.id === id);
  const toggleSave = () => {
    if (!id) return;
    if (isSaved) unsaveListing.mutate(id);
    else saveListing.mutate(id);
  };

  const photos = useMemo(
    () => (listing?.photos ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder),
    [listing]
  );

  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const share = () => {
    if (!listing) return;
    Share.share({
      message: `${listing.title} — ${listing.area}, ${listing.city}. ${formatNaira(
        listing.annualRent
      )}/year on Homelyn.`,
    });
  };

  const totalCost = listing
    ? listing.annualRent + listing.serviceCharge + listing.cautionDeposit + listing.agencyFee
    : 0;

  // ── Loading / error states ──
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
        <StatusBar barStyle="dark-content" />
        <Skeleton style={{ height: HERO_HEIGHT }} />
        <View style={{ padding: 20, gap: 14 }}>
          <Skeleton style={{ height: 28, width: 180, borderRadius: 8 }} />
          <Skeleton style={{ height: 22, width: 260, borderRadius: 8 }} />
          <Skeleton style={{ height: 16, width: 200, borderRadius: 8 }} />
          <Skeleton style={{ height: 100, borderRadius: 16, marginTop: 10 }} />
          <Skeleton style={{ height: 160, borderRadius: 16 }} />
        </View>
      </View>
    );
  }

  if (isError || !listing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FAF7F2',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}>
        <Ionicons name="cloud-offline-outline" size={44} color="#C0BBC4" />
        <Text
          style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 17, marginTop: 14 }}>
          {"Couldn't load this listing"}
        </Text>
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            color: '#9CA3AF',
            fontSize: 14,
            marginTop: 6,
            textAlign: 'center',
          }}>
          It may have been removed, or your connection dropped.
        </Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#F0EBE4',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
              Go back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: '#0E7C7B',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isVerifiedLandlord = listing.landlord?.verificationStatus === 'approved';

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {/* ── Photo gallery ── */}
        <View style={{ height: HERO_HEIGHT, backgroundColor: '#E5E0D8' }}>
          {photos.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onGalleryScroll}>
              {photos.map((photo) => (
                <Image
                  key={photo.id}
                  source={{ uri: photo.url }}
                  style={{ width, height: HERO_HEIGHT }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home-outline" size={56} color="#C0BBC4" />
            </View>
          )}

          {/* Floating controls */}
          <View
            style={{
              position: 'absolute',
              top: 54,
              left: 20,
              right: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 42,
                height: 42,
                borderRadius: 999,
                backgroundColor: 'rgba(26,35,50,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={share}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  backgroundColor: 'rgba(26,35,50,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="share-social-outline" size={19} color="white" />
              </TouchableOpacity>
              {isTenant && (
                <TouchableOpacity
                  onPress={toggleSave}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    backgroundColor: 'rgba(26,35,50,0.4)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons
                    name={isSaved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isSaved ? '#F2A65A' : 'white'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {photos.length > 1 && (
            <View
              style={{
                position: 'absolute',
                bottom: 16,
                right: 20,
                borderRadius: 999,
                backgroundColor: 'rgba(26,35,50,0.55)',
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 11 }}>
                {photoIndex + 1}/{photos.length}
              </Text>
            </View>
          )}
        </View>

        {/* ── Content ── */}
        <View style={{ padding: 20, paddingBottom: 140 }}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text
                style={{
                  fontFamily: 'Geist_700Bold',
                  color: '#0E7C7B',
                  fontSize: 26,
                  letterSpacing: -0.5,
                }}>
                {formatNaira(listing.annualRent)}
              </Text>
              <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 14 }}>
                / year
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 22,
                letterSpacing: -0.3,
                marginTop: 6,
                lineHeight: 28,
              }}>
              {listing.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
              <Ionicons name="location-outline" size={15} color="#0E7C7B" />
              <Text style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 14 }}>
                {listing.area}, {listing.city}, {listing.state}
              </Text>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              <StatChip
                icon="bed-outline"
                label={`${listing.bedrooms} bed${listing.bedrooms === 1 ? '' : 's'}`}
              />
              <StatChip
                icon="water-outline"
                label={`${listing.bathrooms} bath${listing.bathrooms === 1 ? '' : 's'}`}
              />
              {listing.toilets > 0 && (
                <StatChip
                  icon="ellipse-outline"
                  label={`${listing.toilets} toilet${listing.toilets === 1 ? '' : 's'}`}
                />
              )}
              {!!listing.squareFootage && (
                <StatChip icon="resize-outline" label={`${listing.squareFootage} sqft`} />
              )}
            </View>
          </Animated.View>

          {/* Guarantee banner */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: '#F0FAF9',
              borderRadius: 18,
              padding: 16,
              marginTop: 22,
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#0E7C7B',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="shield-checkmark" size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
                No hidden fees
              </Text>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#6B7280',
                  fontSize: 12,
                  marginTop: 2,
                  lineHeight: 17,
                }}>
                Every cost is listed upfront and verified by Homelyn.
              </Text>
            </View>
          </Animated.View>

          {/* Cost breakdown */}
          <Animated.View entering={FadeInDown.delay(140).duration(400)} style={{ marginTop: 26 }}>
            <SectionTitle>Cost breakdown</SectionTitle>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: '#F0EBE4',
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}>
              <CostRow label="Annual rent" kobo={listing.annualRent} />
              <CostRow label="Service charge" kobo={listing.serviceCharge} />
              <CostRow label="Caution deposit" kobo={listing.cautionDeposit} />
              <CostRow label="Agency fee" kobo={listing.agencyFee} />
              <View style={{ height: 1, backgroundColor: '#F0EBE4' }} />
              <CostRow label="Total move-in cost" kobo={totalCost} bold />
            </View>
          </Animated.View>

          {/* Description */}
          {!!listing.description && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ marginTop: 26 }}>
              <SectionTitle>About this home</SectionTitle>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#6B7280',
                  fontSize: 14.5,
                  lineHeight: 23,
                }}>
                {listing.description}
              </Text>
            </Animated.View>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <Animated.View entering={FadeInDown.delay(260).duration(400)} style={{ marginTop: 26 }}>
              <SectionTitle>Amenities</SectionTitle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {listing.amenities.map((amenity) => (
                  <View
                    key={amenity}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#F0EBE4',
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 11,
                      width: (width - 50) / 2,
                    }}>
                    <Ionicons name={amenityIcon(amenity)} size={17} color="#0E7C7B" />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'Geist_500Medium',
                        color: '#1A2332',
                        fontSize: 13,
                        flex: 1,
                      }}>
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Landlord */}
          {listing.landlord && (
            <Animated.View entering={FadeInDown.delay(320).duration(400)} style={{ marginTop: 26 }}>
              <SectionTitle>Landlord</SectionTitle>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: 'white',
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: '#F0EBE4',
                  padding: 16,
                }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor: '#F0FAF9',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 20 }}>
                    {listing.landlord.name?.charAt(0)?.toUpperCase() ?? 'L'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 15 }}>
                    {listing.landlord.name}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    {isVerifiedLandlord ? (
                      <>
                        <Ionicons name="shield-checkmark" size={13} color="#0E7C7B" />
                        <Text
                          style={{ fontFamily: 'Geist_500Medium', color: '#0E7C7B', fontSize: 12 }}>
                          Verified property owner
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12 }}>
                        Property owner
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.ScrollView>

      {/* ── Floating header (appears on scroll) ── */}
      <Animated.View
        style={[
          headerStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(250,247,242,0.97)',
            paddingTop: 54,
            paddingBottom: 12,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F0EBE4',
          },
        ]}
        pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#F0EBE4',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="arrow-back" size={18} color="#1A2332" />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 15, flex: 1 }}>
          {listing.title}
        </Text>
      </Animated.View>

      {/* ── Bottom action bar (tenants only) ── */}
      {isTenant && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            gap: 12,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#F0EBE4',
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 32,
          }}>
          <TouchableOpacity
            onPress={toggleSave}
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              backgroundColor: '#FAF7F2',
              borderWidth: 1,
              borderColor: '#F0EBE4',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={22}
              color={isSaved ? '#F2A65A' : '#1A2332'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSheetOpen(true)}
            activeOpacity={0.9}
            style={{
              flex: 1,
              height: 54,
              borderRadius: 16,
              backgroundColor: '#0E7C7B',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 15 }}>
              Request viewing
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {id && <RequestViewingSheet propertyId={id} visible={sheetOpen} onClose={() => setSheetOpen(false)} />}
    </View>
  );
}

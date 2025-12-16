'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { getPatient, getPeople, createPatient, deletePerson, updatePatient } from '@/lib/api';
import { Patient, Person } from '@/types';
import { getDashboardTranslation } from '@/lib/dashboard-translations';
import Navbar from '@/components/Navbar';
import PersonCard from '@/components/PersonCard';
import PatientSetup from '@/components/PatientSetup';
import EditPatientModal from '@/components/EditPatientModal';
import PageTransition from '@/components/PageTransition';
import { DashboardSkeleton } from '@/components/Skeleton';
import { NoFamilyMembersEmptyState } from '@/components/EmptyState';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Avatar from '@/components/ui/Avatar';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const router = useRouter();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentDate] = useState(() => new Date());

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    // Fetch patient and people data
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Fetching patient for user:', user.uid);
            const patientResponse = await getPatient(user.uid);
            console.log('Patient response:', patientResponse);

            // Handle patient response (could be object or array)
            let patientData: Patient | null = null;

            if (Array.isArray(patientResponse.data) && patientResponse.data.length > 0) {
                patientData = patientResponse.data[0];
            } else if (patientResponse.data && typeof patientResponse.data === 'object') {
                patientData = patientResponse.data as Patient;
            }

            if (patientData?.id) {
                setPatient(patientData);
                console.log('Patient set:', patientData);

                // Get people
                console.log('Fetching people for patient:', patientData.id);
                const peopleResponse = await getPeople(user.uid, patientData.id);
                console.log('People response:', peopleResponse);

                // Handle people response (could be object or array)
                let peopleArray: Person[] = [];
                if (Array.isArray(peopleResponse.data)) {
                    peopleArray = peopleResponse.data;
                } else if (peopleResponse.data && typeof peopleResponse.data === 'object') {
                    peopleArray = [peopleResponse.data as Person];
                }

                setPeople(peopleArray);
                console.log('People set:', peopleArray);
            } else {
                console.log('No patient found');
                setPatient(null);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(getDashboardTranslation(language, 'failedToLoad'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePatient = async (name: string, age?: number, notes?: string, emergencyContactName?: string, emergencyContactPhone?: string) => {
        if (!user) return;

        try {
            const response = await createPatient(user.uid, name, undefined, age, notes, emergencyContactName, emergencyContactPhone);
            if (response.data) {
                setPatient(Array.isArray(response.data) ? response.data[0] : response.data);
            }
        } catch (err) {
            console.error('Error creating patient:', err);
            setError(getDashboardTranslation(language, 'failedToCreate'));
        }
    };

    const handleEditPerson = (person: Person) => {
        router.push(`/add-person?edit=${person.id}`);
    };

    const handleDeletePerson = async (personId: number) => {
        if (!user) return;

        const confirmed = window.confirm(getDashboardTranslation(language, 'confirmDelete'));
        if (!confirmed) return;

        try {
            await deletePerson(user.uid, personId);
            setPeople(people.filter(p => p.id !== personId));
        } catch (err) {
            console.error('Error deleting person:', err);
            setError(getDashboardTranslation(language, 'failedToDelete'));
        }
    };


    const handleUpdatePatient = async (updatedPatientData: Patient) => {
        if (!user || !patient) return;

        try {
            const response = await updatePatient(user.uid, {
                name: updatedPatientData.name,
                age: updatedPatientData.age,
                notes: updatedPatientData.notes,
                photo_url: updatedPatientData.photo_url,
                emergency_contact_name: updatedPatientData.emergency_contact_name,
                emergency_contact_phone: updatedPatientData.emergency_contact_phone,
            });

            if (response.data) {
                const updatedPatient = Array.isArray(response.data) ? response.data[0] : response.data;
                setPatient(updatedPatient);
                setIsEditModalOpen(false);
            }
        } catch (err) {
            console.error('Error updating patient:', err);
            setError('Failed to update patient. Please try again.');
        }
    };

    const greeting = useMemo(() => {
        const hour = currentDate.getHours();
        if (hour < 5) return { text: 'Good night', iconName: 'moon' as const };
        if (hour < 12) return { text: 'Good morning', iconName: 'sunrise' as const };
        if (hour < 18) return { text: 'Good afternoon', iconName: 'sun' as const };
        return { text: 'Good evening', iconName: 'moon' as const };
    }, [currentDate]);

    const formattedDate = useMemo(() => {
        return currentDate.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    }, [currentDate]);

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    // No patient yet - show setup
    if (!patient) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <PatientSetup onSubmit={handleCreatePatient} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />

            <PageTransition>
                <div className="container mx-auto px-4 py-8">
                    {/* Top sticky header */}
                    <div className="sticky top-16 z-30 -mx-4 px-4 pt-2 pb-4 mb-6 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200/60">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">
                                    {formattedDate}
                                </p>
                                <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 flex items-center gap-2">
                                    <Icon name={greeting.iconName} size={24} className="text-amber-500" />
                                    <span>
                                        {greeting.text}
                                        {user?.displayName ? `, ${user.displayName}` : ''}
                                    </span>
                                </h1>
                            </div>
                            <div className="shrink-0">
                                <div className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 bg-gradient-to-br from-primary-50 to-accent-50 border border-neutral-200 shadow-soft text-xs sm:text-sm text-neutral-700">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-neutral-900">
                                            Calm & clear
                                        </span>
                                        <span className="text-neutral-500">
                                            Perfect day for familiar faces
                                        </span>
                                    </div>
                                    <span className="text-2xl hidden sm:inline">😊</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-soft animate-fade-in">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                                <Icon name="alert" size={18} />
                            </div>
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* Patient banner */}
                    <div className="mb-8 animate-fade-in-up">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-50 via-accent-50 to-primary-50 border border-primary-100/60 shadow-soft">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute top-3 right-3 p-2 bg-white/60 hover:bg-white shadow-soft rounded-xl transition-all duration-200 touch-target hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50"
                                title="Edit Patient"
                                aria-label="Edit Patient"
                            >
                                <Icon name="edit" size={16} className="text-primary-700" />
                            </button>

                            <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5">
                                <div className="shrink-0">
                                    <Avatar
                                        src={patient.photo_url || undefined}
                                        name={patient.name}
                                        size="xl"
                                        className="ring-4 ring-white shadow-soft"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 truncate">
                                            {patient.name}
                                        </h2>
                                        {patient.age && (
                                            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary-800 border border-primary-100">
                                                {patient.age} {getDashboardTranslation(language, 'yearsOld')}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-neutral-600 border border-neutral-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>{getDashboardTranslation(language, 'helping')}</span>
                                        </span>
                                    </div>
                                    {patient.notes && (
                                        <p className="text-xs sm:text-sm text-neutral-600 truncate">
                                            {patient.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="hidden sm:flex flex-col items-end justify-center gap-1 pr-2">
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                                        {getDashboardTranslation(language, 'familyMembers')}
                                    </p>
                                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 border border-neutral-200 shadow-inner-soft">
                                        <Icon name="users" size={16} className="text-primary-700" />
                                        <span className="text-sm font-semibold text-neutral-900">
                                            {people.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Who is this - primary */}
                            <button
                                onClick={() => router.push('/camera')}
                                className="group relative flex-1 md:basis-3/5 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white px-5 sm:px-7 py-5 sm:py-6 shadow-soft-lg overflow-hidden text-left transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
                            >
                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
                                <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-accent-500/25 blur-3xl" />
                                <div className="relative flex items-center gap-4 sm:gap-5">
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center shadow-soft">
                                            <Icon name="camera" size={28} className="text-white" />
                                        </div>
                                        <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/40 ring-[6px] ring-white/10 animate-pulse-soft" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-100">
                                            Primary action
                                        </p>
                                        <p className="mt-1 text-lg sm:text-xl font-semibold">
                                            {getDashboardTranslation(language, 'whoIsThis')}
                                        </p>
                                        <p className="mt-1 text-sm text-primary-100">
                                            Tap to recognize someone standing in front of your loved one.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Add person - secondary */}
                            <button
                                onClick={() => router.push('/add-person')}
                                className="group flex-1 md:basis-2/5 rounded-2xl bg-white border border-primary-100 px-5 sm:px-6 py-5 sm:py-6 shadow-soft text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 group-hover:bg-primary-100 group-hover:border-primary-200 transition-colors">
                                        <Icon name="plus" size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-900">
                                            {getDashboardTranslation(language, 'addFamilyMember')}
                                        </p>
                                        <p className="mt-1 text-sm text-neutral-500">
                                            Add a new family member or caregiver profile.
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Family members */}
                    {people.length === 0 ? (
                        <NoFamilyMembersEmptyState
                            onAdd={() => router.push('/add-person')}
                        />
                    ) : (
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900">
                                    {getDashboardTranslation(language, 'familyMembersTitle')}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-100">
                                        {people.length} {people.length === 1 ? 'Member' : 'Members'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const el = document.getElementById('family-grid');
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800"
                                    >
                                        <span>View all</span>
                                        <Icon name="arrowRight" size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile - horizontal scroll */}
                            <div className="md:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar pb-2" id="family-grid">
                                <div className="flex gap-4 snap-x snap-mandatory">
                                    {people.map((person) => (
                                        <div key={person.id} className="snap-start min-w-[260px] max-w-[280px]">
                                            <PersonCard
                                                person={person}
                                                onEdit={handleEditPerson}
                                                onDelete={handleDeletePerson}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop - grid */}
                            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children" id="family-grid">
                                {people.map((person) => (
                                    <div key={person.id}>
                                        <PersonCard
                                            person={person}
                                            onEdit={handleEditPerson}
                                            onDelete={handleDeletePerson}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick stats bar */}
                    <div className="mt-10 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className="rounded-xl bg-white border border-neutral-200 px-4 py-3 flex items-center justify-between shadow-soft">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                                        People added
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-neutral-900">
                                        {people.length}
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                                    <Icon name="users" size={18} className="text-primary-700" />
                                </div>
                            </div>

                            <div className="rounded-xl bg-white border border-neutral-200 px-4 py-3 flex items-center justify-between shadow-soft">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                                        Recognized today
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-neutral-900">
                                        0
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-accent-50 flex items-center justify-center">
                                    <Icon name="camera" size={18} className="text-accent-600" />
                                </div>
                            </div>

                            <div className="rounded-xl bg-white border border-neutral-200 px-4 py-3 flex items-center justify-between shadow-soft">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                                        Connection streak
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-neutral-900">
                                        0 days
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Icon name="heart" size={18} className="text-emerald-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Recognition Button (Mobile) - Positioned above SOS button */}
                <button
                    onClick={() => router.push('/camera')}
                    className="fixed bottom-28 right-6 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-[0_0_0_1px_rgba(13,148,136,0.4),0_0_25px_rgba(13,148,136,0.6)] flex items-center justify-center md:hidden transition-all duration-300 hover:scale-110 touch-target focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 animate-pulse-soft z-[90]"
                    aria-label="Open Camera"
                >
                    <Icon name="camera" size={24} />
                </button>

                {/* Edit Patient Modal */}
                {patient && (
                    <EditPatientModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        patient={patient}
                        onSave={handleUpdatePatient}
                    />
                )}
            </PageTransition>
        </div>
    );
}

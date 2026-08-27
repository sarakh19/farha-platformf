<?php

namespace Database\Seeders;
use App\Models\Category;
use App\Models\Event;
use App\Models\User;


//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // جلب المنظمين من جدول users
        $amalOrganization = User::where('name', 'جمعية الأمل')
            ->where('role', 'organizer')
            ->firstOrFail();

        $basmaTeam = User::where('name', 'فريق بسمة')
            ->where('role', 'organizer')
            ->firstOrFail();

        $tomorrowInitiative = User::where('name', 'مبادرة الغد')
            ->where('role', 'organizer')
            ->firstOrFail();
 // جلب الفئات من جدول categories
        $educationalCategory = Category::where('name', 'تعليمية')
            ->firstOrFail();

        $sportsCategory = Category::where('name', 'رياضية')
            ->firstOrFail();

        $artCategory = Category::where('name', 'فنية')
            ->firstOrFail();

        $entertainmentCategory = Category::where('name', 'ترفيهية')
            ->firstOrFail();

        $psychologicalSupportCategory = Category::where(
            'name',
            'دعم نفسي'
            )->firstOrFail();//استخدمناها لانه في حال مالقى لارفل اسم الفئة يظهر خطأ عشان بعدين مانكتشف انه في عندي حقول فاضية
     //جلب الفعاليات من جدول الفعاليات 
     Event::create([
    'organizer_id' => $amalOrganization->id,
    'category_id' => $entertainmentCategory->id,
    'title' => 'مسرح الدمى للأطفال',
    'description' => 'عرض ترفيهي ممتع للأطفال باستخدام الدمى لتنمية الخيال والإبداع.',
    'event_type' => 'حضورية',
    'event_date' => '2025-05-24',
    'start_time' => '18:00',//خزنت بالطريقة هاي لانه mysql بخزن الساعة بصيغة 24ساعة
    'end_time' => '19:00',
    'location' => 'مسرح غزة',
    'address' => 'غزة',
    'age_group' => '3-8',
    'capacity' => 50,
    'requirements' => 'لا يوجد',
    'image' => 'events/puppet-theater.png',
    'status' => 'approved',
]);
//
Event::create([
    'organizer_id' => $basmaTeam->id,
    'category_id' => $artCategory->id,
    'title' => 'ورشة الرسم والإبداع',
    'description' => 'ورشة فنية تساعد الأطفال على التعبير عن أفكارهم من خلال الرسم والألوان.',
    'event_type' => 'حضورية',
    'event_date' => '2025-05-26',
    'start_time' => '15:00',
    'end_time' => '17:00',
    'location' => 'مركز بسمة',
    'address' => 'غزة',
    'age_group' => '5-12',
    'capacity' => 30,
    'requirements' => 'ملابس مناسبة للرسم',
    'image' => 'events/art-workshop.png',
    'status' => 'approved',
]);
//
Event::create([
    'organizer_id' => $amalOrganization->id,
    'category_id' => $sportsCategory->id,
    'title' => 'البطولة الرياضية للأطفال',
    'description' => 'أنشطة رياضية وألعاب جماعية لتعزيز اللياقة والعمل بروح الفريق.',
    'event_type' => 'حضورية',
    'event_date' => '2025-05-29',
    'start_time' => '16:00',
    'end_time' => '18:00',
    'location' => 'الملعب البلدي',
    'address' => 'غزة',
    'age_group' => '7-12',
    'capacity' => 40,
    'requirements' => 'ملابس رياضية',
    'image' => 'events/sports.png',
    'status' => 'approved',
]);
//
Event::create([
    'organizer_id' => $tomorrowInitiative->id,
    'category_id' => $educationalCategory->id,
    'title' => 'ورشة البرمجة للأطفال',
    'description' => 'تعريف الأطفال بأساسيات البرمجة بطريقة ممتعة وتفاعلية.',
    'event_type' => 'حضورية',
    'event_date' => '2025-06-01',
    'start_time' => '14:00',
    'end_time' => '16:00',
    'location' => 'مركز التكنولوجيا',
    'address' => 'غزة',
    'age_group' => '10-15',
    'capacity' => 25,
    'requirements' => 'إحضار لابتوب إن وجد',
    'image' => 'events/programming.png',
    'status' => 'approved',
]);
//
Event::create([
    'organizer_id' => $basmaTeam->id,
    'category_id' => $psychologicalSupportCategory->id,
    'title' => 'جلسة دعم نفسي للأطفال',
    'description' => 'جلسة تفاعلية تهدف إلى دعم الأطفال نفسيًا وتعزيز الشعور بالأمان.',
    'event_type' => 'حضورية',
    'event_date' => '2025-06-03',
    'start_time' => '11:00',
    'end_time' => '12:30',
    'location' => 'مركز الأمل',
    'address' => 'غزة',
    'age_group' => '6-12',
    'capacity' => 20,
    'requirements' => 'لا يوجد',
    'image' => 'events/psychological-support.png',
    'status' => 'approved',
]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class RealOrganizationsSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | مهم
        |--------------------------------------------------------------------------
        |
        | هذا الـSeeder يمسح:
        | - كل التسجيلات القديمة
        | - كل الفعاليات القديمة
        | - كل التصنيفات القديمة
        |
        | ثم ينشئ:
        | - 4 تصنيفات فقط
        | - 3 مؤسسات
        | - 9 فعاليات وهمية
        |
        | صور الفعاليات يتم تنزيلها مرة واحدة وحفظها محليًا داخل:
        |
        | public/images.1/events/
        |
        */

        $this->resetEventsAndCategories();


        /*
        |--------------------------------------------------------------------------
        | 1) التصنيفات النهائية - أربعة فقط
        |--------------------------------------------------------------------------
        */

        $educationCategory = Category::create([
            'name' => 'تعليمية وثقافية',
        ]);


        $artEntertainmentCategory = Category::create([
            'name' => 'فنية وترفيهية',
        ]);


        $healthCategory = Category::create([
            'name' => 'صحة وتوعية',
        ]);


        $protectionCategory = Category::create([
            'name' => 'حماية ودعم نفسي',
        ]);


        /*
        |--------------------------------------------------------------------------
        | 2) المؤسسات
        |--------------------------------------------------------------------------
        |
        | أسماء وبيانات المؤسسات مأخوذة من البيانات التي زُوّد بها المشروع.
        | البريد المستخدم للدخول تجريبي من نطاق .test.
        |
        */

        $beitLahia = $this->createOrganizer(
            name: 'جمعية تطوير بيت لاهيا',
            loginEmail: 'beitlahia@farha.test',
            phone: '+98 532 478 970',
            city: 'غزة',
            address: 'دير البلح - شارع السلام / غزة - خلف شركة جوال - برج مشتهى (3)',
            bio: 'مؤسسة أهلية غير ربحية تعمل في البرامج التنموية والإغاثية والدعم الإنساني والغذائي والبنية التحتية والتعليم والصحة وتمكين الشباب.'
        );


        $tamer = $this->createOrganizer(
            name: 'مؤسسة تامر للتعليم المجتمعي',
            loginEmail: 'tamer@farha.test',
            phone: '+6121 298 2 970',
            city: 'غزة',
            address: 'غزة - ملعب فلسطين - بالقرب من العائلة المقدسة',
            bio: 'مؤسسة تعمل مع الأطفال والشباب وتوفر بيئات ومواد تعليمية آمنة، وتنفذ أنشطة قراءة ونشر وورش عمل وتدعم المكتبات المحلية.'
        );


        $future = $this->createOrganizer(
            name: 'هيئة المستقبل للتنمية',
            loginEmail: 'future@farha.test',
            phone: '00970594785158',
            city: 'غزة',
            address: 'غزة - عمارة حرز هادي',
            bio: 'مؤسسة تقدم برامج مرتبطة بالحماية وتنفذ فعاليات وبرامج موجهة للأطفال.'
        );


        /*
        |--------------------------------------------------------------------------
        | 3) فعاليات جمعية تطوير بيت لاهيا
        |--------------------------------------------------------------------------
        */

        $this->createEvent(
            organizer: $beitLahia,

            category: $healthCategory,

            title: 'صحتي أولاً',

            description: 'يوم توعوي تفاعلي للأطفال حول النظافة الشخصية والتغذية الصحية والعادات اليومية السليمة، مع ألعاب ومسابقات تعليمية مبسطة.',

            date: '2026-09-15',

            start: '10:00',

            end: '13:00',

            location: 'دير البلح',

            address: 'شارع السلام - دير البلح',

            ageGroup: '6-12 سنة',

            capacity: 40,

            requirements: 'التسجيل المسبق وحضور ولي الأمر عند التسجيل الأول.',

            imageUrl: 
                '/images.1/events/health.jpg'
            
        );


        $this->createEvent(
            organizer: $beitLahia,

            category: $educationCategory,

            title: 'نستعد للمدرسة',

            description: 'فعالية تعليمية وترفيهية تساعد الأطفال على الاستعداد للعام الدراسي من خلال ألعاب معرفية وأنشطة جماعية وتمارين بسيطة لتنظيم الوقت.',

            date: '2026-09-24',

            start: '10:30',

            end: '13:00',

            location: 'دير البلح',

            address: 'دير البلح - قطاع غزة',

            ageGroup: '6-14 سنة',

            capacity: 50,

            requirements: 'التسجيل المسبق عبر منصة فرحة.',

            imageUrl: 
                '/images.1/events/school.jpg'
           
        );


        $this->createEvent(
            organizer: $beitLahia,

            category: $artEntertainmentCategory,

            title: 'يوم المرح والحركة',

            description: 'أنشطة حركية وألعاب جماعية وفقرات فنية خفيفة تساعد الأطفال على التفاعل وبناء روح الفريق ضمن أجواء آمنة وممتعة.',

            date: '2026-10-03',

            start: '11:00',

            end: '14:00',

            location: 'غزة',

            address: 'قطاع غزة',

            ageGroup: '7-14 سنة',

            capacity: 35,

            requirements: 'ملابس مريحة مناسبة للأنشطة الحركية.',

            imageUrl: 
                '/images.1/events/fun.jpg'
            
        );


        /*
        |--------------------------------------------------------------------------
        | 4) فعاليات مؤسسة تامر للتعليم المجتمعي
        |--------------------------------------------------------------------------
        */

        $this->createEvent(
            organizer: $tamer,

            category: $educationCategory,

            title: 'قارئ صغير',

            description: 'جلسة قراءة تفاعلية للأطفال تتضمن قصة قصيرة ونقاشاً مبسطاً وألعاباً لغوية تشجع على حب القراءة والتعبير عن الأفكار.',

            date: '2026-09-20',

            start: '11:00',

            end: '13:00',

            location: 'غزة',

            address: 'ملعب فلسطين - بالقرب من العائلة المقدسة',

            ageGroup: '6-10 سنوات',

            capacity: 25,

            requirements: 'لا توجد متطلبات خاصة.',

            imageUrl: 
                '/images.1/events/reading.jpg'
           
        );


        $this->createEvent(
            organizer: $tamer,

            category: $artEntertainmentCategory,

            title: 'ألوان وحكايات',

            description: 'ورشة تجمع بين سرد القصص والرسم والتلوين، ويعبّر فيها الأطفال عن أحداث القصة وشخصياتها باستخدام الألوان والخيال.',

            date: '2026-09-29',

            start: '12:00',

            end: '14:30',

            location: 'غزة',

            address: 'ملعب فلسطين - بالقرب من العائلة المقدسة',

            ageGroup: '7-12 سنة',

            capacity: 30,

            requirements: 'سيتم توفير جميع الأدوات والمواد.',

            imageUrl: 
                '/images.1/events/art.jpg'
          
        );


        $this->createEvent(
            organizer: $tamer,

            category: $educationCategory,

            title: 'أنا أكتب قصتي',

            description: 'ورشة كتابة إبداعية تساعد الأطفال على ابتكار شخصيات وبناء قصة قصيرة والتعبير عنها بالكلمات والرسومات بطريقة ممتعة.',

            date: '2026-10-08',

            start: '10:00',

            end: '12:30',

            location: 'غزة',

            address: 'غزة - بالقرب من ملعب فلسطين',

            ageGroup: '9-14 سنة',

            capacity: 40,

            requirements: 'إجادة القراءة والكتابة بالمستوى المناسب للعمر.',

            imageUrl:
                '/images.1/events/writing.jpg'
           
        );


        /*
        |--------------------------------------------------------------------------
        | 5) فعاليات هيئة المستقبل للتنمية
        |--------------------------------------------------------------------------
        */

        $this->createEvent(
            organizer: $future,

            category: $protectionCategory,

            title: 'أنا آمن',

            description: 'فعالية مبسطة لتعريف الأطفال بمفهوم الأمان الشخصي وكيفية طلب المساعدة والتعامل مع المواقف غير المريحة بطريقة مناسبة لأعمارهم.',

            date: '2026-09-25',

            start: '10:00',

            end: '12:30',

            location: 'غزة',

            address: 'عمارة حرز هادي - غزة',

            ageGroup: '7-12 سنة',

            capacity: 30,

            requirements: 'موافقة ولي الأمر على مشاركة الطفل.',

            imageUrl: 
                '/images.1/events/safety.jpg'
          
        );


        $this->createEvent(
            organizer: $future,

            category: $protectionCategory,

            title: 'مساحتي الآمنة',

            description: 'جلسة جماعية داعمة تساعد الأطفال على التعبير عن المشاعر والتواصل وطلب الدعم، من خلال أنشطة وألعاب مناسبة للفئة العمرية.',

            date: '2026-10-05',

            start: '10:30',

            end: '13:00',

            location: 'غزة',

            address: 'عمارة حرز هادي - غزة',

            ageGroup: '6-14 سنة',

            capacity: 35,

            requirements: 'التسجيل من حساب ولي الأمر في منصة فرحة.',

            imageUrl: 
                '/images.1/events/group (1).jpg'
           
        );


        $this->createEvent(
            organizer: $future,

            category: $artEntertainmentCategory,

            title: 'حقي في اللعب',

            description: 'يوم ترفيهي للأطفال يتضمن ألعاباً جماعية وأنشطة حركية وفنية مع رسائل مبسطة حول حق الطفل في اللعب والمشاركة ضمن بيئة آمنة.',

            date: '2026-10-12',

            start: '11:00',

            end: '14:00',

            location: 'غزة',

            address: 'غزة - عمارة حرز هادي',

            ageGroup: '6-12 سنة',

            capacity: 40,

            requirements: 'ملابس مريحة والحضور قبل بداية الفعالية بـ15 دقيقة.',

            imageUrl: 
                '/images.1/events/playground.jpg'
       
        );
    }


    /*
    |--------------------------------------------------------------------------
    | حذف الفعاليات والتصنيفات القديمة
    |--------------------------------------------------------------------------
    */

    private function resetEventsAndCategories(): void
    {
        DB::statement(
            'SET FOREIGN_KEY_CHECKS=0'
        );


        try {

            if (
                Schema::hasTable(
                    'registrations'
                )
            ) {

                DB::table(
                    'registrations'
                )->truncate();
            }


            if (
                Schema::hasTable(
                    'events'
                )
            ) {

                DB::table(
                    'events'
                )->truncate();
            }


            if (
                Schema::hasTable(
                    'categories'
                )
            ) {

                DB::table(
                    'categories'
                )->truncate();
            }

        } finally {

            DB::statement(
                'SET FOREIGN_KEY_CHECKS=1'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | تنزيل صورة الفعالية وحفظها محليًا
    |--------------------------------------------------------------------------
    */

    private function downloadEventImage(
        string $url,
        string $fileName
    ): string {

        /*
         * مكان تخزين الصور داخل public
         */

        $directory =
            public_path(
                'images.1/events'
            );


        /*
         * إذا المجلد غير موجود، ننشئه.
         */

        if (
            !File::exists(
                $directory
            )
        ) {

            File::makeDirectory(
                $directory,
                0755,
                true
            );
        }


        $fullPath =
            $directory
            . DIRECTORY_SEPARATOR
            . $fileName;


        /*
         * إذا الصورة موجودة من قبل، لا ننزلها مرة ثانية.
         */

        if (
            File::exists(
                $fullPath
            )
        ) {

            return
                '/images.1/events/'
                . $fileName;
        }


        try {

            /*
             * تحميل الصورة.
             */

            $response =
                Http::timeout(30)
                    ->withOptions([
                        'allow_redirects' =>
                            true,
                    ])
                    ->get(
                        $url
                    );


            /*
             * إذا نجح التحميل، نحفظ الصورة.
             */

            if (
                $response->successful()
            ) {

                File::put(
                    $fullPath,
                    $response->body()
                );


                return
                    '/images.1/events/'
                    . $fileName;
            }

        } catch (
            \Throwable $e
        ) {

            /*
             * إذا فشل تحميل الصورة لأي سبب،
             * لا نوقف الـSeeder كامل.
             */
        }


        /*
         * صورة احتياطية إذا فشل التحميل.
         */

        return
            '/images.1/Image.png';
    }


    /*
    |--------------------------------------------------------------------------
    | إنشاء / تحديث المنظم
    |--------------------------------------------------------------------------
    */

    private function createOrganizer(
        string $name,
        string $loginEmail,
        ?string $phone = null,
        ?string $city = null,
        ?string $address = null,
        ?string $bio = null
    ): User {

        $data = [

            'name' =>
                $name,

            'email' =>
                $loginEmail,

            'password' =>
                Hash::make(
                    'Farha@2026'
                ),

            'role' =>
                'organizer',
        ];


        if (
            Schema::hasColumn(
                'users',
                'phone'
            )
        ) {

            $data['phone'] =
                $phone;
        }


        if (
            Schema::hasColumn(
                'users',
                'city'
            )
        ) {

            $data['city'] =
                $city;
        }


        if (
            Schema::hasColumn(
                'users',
                'address'
            )
        ) {

            $data['address'] =
                $address;
        }


        if (
            Schema::hasColumn(
                'users',
                'bio'
            )
        ) {

            $data['bio'] =
                $bio;
        }


        if (
            Schema::hasColumn(
                'users',
                'is_active'
            )
        ) {

            $data['is_active'] =
                true;
        }


        if (
            Schema::hasColumn(
                'users',
                'email_registration_updates'
            )
        ) {

            $data[
                'email_registration_updates'
            ] = false;
        }


        return User::updateOrCreate(

            [
                'email' =>
                    $loginEmail,
            ],

            $data
        );
    }


    /*
    |--------------------------------------------------------------------------
    | إنشاء فعالية
    |--------------------------------------------------------------------------
    */

    private function createEvent(
        User $organizer,
        Category $category,
        string $title,
        string $description,
        string $date,
        string $start,
        string $end,
        string $location,
        ?string $address,
        string $ageGroup,
        int $capacity,
        ?string $requirements = null,
        ?string $imageUrl = null
    ): Event {

        $data = [

            'organizer_id' =>
                $organizer->id,

            'category_id' =>
                $category->id,

            'title' =>
                $title,

            'description' =>
                $description,

            'event_date' =>
                $date,

            'location' =>
                $location,

            'capacity' =>
                $capacity,

            'status' =>
                'approved',
        ];


        /*
         * نوع الفعالية
         */

        if (
            Schema::hasColumn(
                'events',
                'event_type'
            )
        ) {

            $data['event_type'] =
                'حضورية';
        }


        /*
         * وقت البداية
         */

        if (
            Schema::hasColumn(
                'events',
                'start_time'
            )
        ) {

            $data['start_time'] =
                $start;
        }


        /*
         * وقت النهاية
         */

        if (
            Schema::hasColumn(
                'events',
                'end_time'
            )
        ) {

            $data['end_time'] =
                $end;
        }


        /*
         * دعم Migration أقدم
         */

        if (
            Schema::hasColumn(
                'events',
                'event_time'
            )
        ) {

            $data['event_time'] =
                $start;
        }


        /*
         * العنوان التفصيلي
         */

        if (
            Schema::hasColumn(
                'events',
                'address'
            )
        ) {

            $data['address'] =
                $address;
        }


        /*
         * الفئة العمرية
         */

        if (
            Schema::hasColumn(
                'events',
                'age_group'
            )
        ) {

            $data['age_group'] =
                $ageGroup;
        }


        /*
         * المتطلبات
         */

        if (
            Schema::hasColumn(
                'events',
                'requirements'
            )
        ) {

            $data['requirements'] =
                $requirements;
        }


        /*
         * مسار الصورة المحلية
         */

        if (
            Schema::hasColumn(
                'events',
                'image'
            )
        ) {

            $data['image'] =
                $imageUrl;
        }


        return Event::create(
            $data
        );
    }
}
package vn.edu.crs.registrationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.edu.crs.registrationservice.client.CourseClient;
import vn.edu.crs.registrationservice.dto.RegistrationRequest;
import vn.edu.crs.registrationservice.entity.Registration;
import vn.edu.crs.registrationservice.repository.RegistrationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);
    private static final String DA_DANG_KY = "DA_DANG_KY";
    private static final String DA_HUY = "DA_HUY";

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public RegistrationService(RegistrationRepository registrationRepository, CourseClient courseClient) {
        this.registrationRepository = registrationRepository;
        this.courseClient = courseClient;
    }

    public Registration register(RegistrationRequest request) {
        logger.info("[RegistrationService] Registering - studentId: {}, courseId: {}", request.getStudentId(), request.getCourseId());
        if (registrationRepository.existsByStudentIdAndCourseIdAndTrangThai(
                request.getStudentId(), request.getCourseId(), DA_DANG_KY)) {
            throw new IllegalStateException("Sinh vien da dang ky mon hoc nay roi");
        }

        // Goi sang course-service de tru cho TRUOC. Neu nem exception, dung lai ngay, khong luu Registration.
        courseClient.reserveSeat(request.getCourseId());

        Registration registration = new Registration();
        registration.setStudentId(request.getStudentId());
        registration.setCourseId(request.getCourseId());
        registration.setTrangThai(DA_DANG_KY);
        registration.setNgayDangKy(LocalDateTime.now());
        Registration saved = registrationRepository.save(registration);
        logger.info("[RegistrationService] Registration saved - id: {}, studentId: {}, courseId: {}", saved.getId(), saved.getStudentId(), saved.getCourseId());
        return saved;
    }

    public void cancel(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay dang ky id = " + registrationId));

        if (DA_HUY.equals(registration.getTrangThai())) {
            throw new IllegalStateException("Dang ky nay da duoc huy truoc do");
        }

        // Goi sang course-service de hoan tra cho TRUOC khi doi trang thai
        courseClient.releaseSeat(registration.getCourseId());
        registration.setTrangThai(DA_HUY);
        registrationRepository.save(registration);
    }

    public List<Registration> getMyRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
}
